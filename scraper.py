import argparse
import gzip
import json
import pathlib
import random
import string
from functools import partial
from time import sleep
from typing import Callable, List, Optional

import requests
from bs4 import BeautifulSoup


def get_all_business_words() -> List[str]:
    word_list: List[str] = []
    base_url = "https://wirtschaftslexikon.gabler.de/"
    link = "/definition-a-z/a-z"

    def get_business_page(url: str) -> Optional[str]:
        print(f"Getting: {url}")
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        word_list.extend(
            [keyword.text.strip().lower() for keyword in soup.find_all(class_="keyword")]
        )
        try:
            return soup.find("a", {"title": "Zur nächsten Seite"})["href"]  # type: ignore
        except Exception:
            return None

    while link:
        link = get_business_page(f"{base_url}{link}")
        sleep(random.uniform(1, 10))
    return word_list


def get_all_german_words() -> List[str]:
    words: List[str] = []
    response = requests.get("http://www.netzmafia.de/software/wordlists/deutsch.txt")
    for line in response.text.splitlines():
        word = line.strip().lower()
        words.append(word)
    return words


def filter_by_length(word_list: List[str], *, min: int, max: int) -> List[str]:
    def length_filter(word: str, min: int, max: int) -> bool:
        if word.__len__() <= max and word.__len__() >= min:
            return True
        return False

    return [*filter(partial(length_filter, min=min, max=max), word_list)]


def filter_by_punctuation(word_list: List[str]) -> List[str]:
    punctuation = set(string.punctuation)

    def punctuation_filter(word: str) -> bool:
        for letter in word:
            if letter in punctuation:
                return False
        return True

    return [*filter(punctuation_filter, word_list)]


def filter_by_spaces(word_list: List[str]) -> List[str]:
    def spaces_filter(word: str) -> bool:
        return False if word.__contains__(" ") else True

    return [*filter(spaces_filter, word_list)]


def replace_sondezeichen(word_list: List[str]) -> None:
    for i, word in enumerate(word_list):
        word = word.replace("ß", "ss")
        word = word.replace("ue", "ü")
        word = word.replace("oe", "ö")
        word = word.replace("ae", "ä")
        word_list[i] = word


def write_word_list(filepath: str, word_list: List[str]) -> None:
    with open(filepath, mode="w", encoding="utf_8") as output:
        _ = [output.write(f"{word}\n") for word in word_list]


def get_with_cache(filepath: str, *, generator: Callable[..., List[str]]) -> List[str]:
    word_list: List[str] = []
    if pathlib.Path(filepath).is_file():
        with open(filepath, mode="r", encoding="utf_8") as cache:
            for line in cache.readlines():
                word_list.append(line.strip())
        return word_list
    word_list = generator()
    write_word_list(filepath, word_list)
    return word_list


def export(word_list: List[str], filename: str) -> None:
    with gzip.open(f"./out/{filename}", mode="wt", encoding="utf_8") as output:
        word_list.sort()
        json.dump(word_list, output, indent=4)  # type: ignore


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--min", type=int, required=True, help="min. wordlength as integer.")
    parser.add_argument("--max", type=int, required=True, help="max. wordlength as integer.")
    args = parser.parse_args()

    word_list = get_with_cache("./out/germanAll.txt", generator=get_all_german_words)
    replace_sondezeichen(word_list)
    word_list = filter_by_length(word_list, min=args.min, max=args.max)
    word_list = filter_by_punctuation(word_list)
    word_list = filter_by_spaces(word_list)
    export(word_list, "german.ListStr.json.gz")

    word_list = get_with_cache("./out/businessAll.txt", generator=get_all_business_words)
    replace_sondezeichen(word_list)
    word_list = filter_by_length(word_list, min=args.min, max=args.max)
    word_list = filter_by_punctuation(word_list)
    word_list = filter_by_spaces(word_list)
    export(word_list, "business_unused.ListStr.json.gz")
    export([], "business_used.ListStr.json.gz")
