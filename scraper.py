import argparse
import requests
from typing import List
from functools import partial


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


def write_word_list(filepath: str, word_list: List[str]) -> None:
    with open(filepath, mode="w", encoding="utf_8") as output:
        _ = [output.write(f"{word}\n") for word in word_list]


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--min", type=int, required=True, help="min. wordlength as integer.")
    parser.add_argument("--max", type=int, required=True, help="max. wordlength as integer.")
    args = parser.parse_args()

    word_list = get_all_german_words()
    write_word_list("./out/germanAll.txt", word_list)
    word_list = filter_by_length(word_list, min=args.min, max=args.max)
    write_word_list("./out/germanFiltered.txt", word_list)
