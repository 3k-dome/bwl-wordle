import argparse
import json
import random
import string
from functools import partial
from pathlib import Path
from time import sleep
from typing import Callable, List, Optional, Set

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
        sleep(random.uniform(1, 5))
    return word_list


def get_all_german_words() -> List[str]:
    words: List[str] = []
    response = requests.get("http://www.netzmafia.de/software/wordlists/deutsch.txt")
    for line in response.text.splitlines():
        word = line.strip().lower()
        words.append(word)
    return words


def get_with_cache(filepath: Path, *, generator: Callable[..., List[str]]) -> List[str]:
    word_list: List[str] = []
    if filepath.is_file():
        return [*load_asset(filepath)]
    word_list = generator()
    save_asset(set(word_list), filepath)
    return word_list


def save_asset(asset: Set[str], filepath: Path) -> None:
    with open(filepath, mode="w", encoding="utf_8") as out:
        json.dump(sorted([*asset]), out, indent=4)


def load_asset(filepath: Path) -> Set[str]:
    with open(filepath, mode="r", encoding="utf_8") as out:
        return set(json.load(out))


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
        word = word.replace("ü", "ue")
        word = word.replace("ö", "oe")
        word = word.replace("ä", "ae")
        word_list[i] = word


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--min", type=int, required=True, help="min. wordlength as integer.")
    parser.add_argument("--max", type=int, required=True, help="max. wordlength as integer.")
    args = parser.parse_args()

    german = get_with_cache(Path("./out/german.cache.json"), generator=get_all_german_words)
    replace_sondezeichen(german)
    german = filter_by_length(german, min=args.min, max=args.max)
    german = filter_by_punctuation(german)
    german = filter_by_spaces(german)

    business = get_with_cache(Path("./out/business.cache.json"), generator=get_all_business_words)
    replace_sondezeichen(business)
    business = filter_by_length(business, min=args.min, max=args.max)
    business = filter_by_punctuation(business)
    business = filter_by_spaces(business)

    save_asset(set(business), Path("./out/unused.json"))
    save_asset(set(), Path("./out/used.json"))
    save_asset(set(business) | set(german), Path("./out/all.json"))
