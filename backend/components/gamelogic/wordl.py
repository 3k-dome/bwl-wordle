import logging
from datetime import datetime
from pathlib import Path

from components.assetmanager.manager import AssetManager
from components.gamelogic.interfaces import GameInfo, ValidatedLetter, ValidatedResult, WordCache


class Wordl:
    def __init__(self, asset_dir: Path) -> None:
        self._asset_dir = asset_dir
        self._day_created = int(datetime.today().strftime("%d"))
        self._select_word()

    def _select_word(self) -> None:
        with AssetManager(self._asset_dir) as manager:
            self._word_cache = WordCache(manager.get_random_word())
            self._dictionary = manager.get_dictionary()
            logging.debug(f"New word is: '{self._word_cache._word}'.")

    def new_game(self) -> GameInfo:
        if self._day_created != int(datetime.today().strftime("%d")):
            logging.debug(f"Date changed, choosing new word.")
            self._select_word()
        return GameInfo(self._word_cache._word.__len__())

    def validate_input(self, input_: str) -> ValidatedResult:
        def is_in_word(letter: str) -> bool:
            return letter in self._word_cache._set

        def is_at_index(letter: str, index: int) -> bool:
            if index < self._word_cache._word.__len__():
                return self._word_cache._word[index] == letter
            return False

        def validate_letter(letter: str, index: int) -> ValidatedLetter:
            return ValidatedLetter(
                letter,
                is_in_word(letter),
                is_at_index(letter, index),
                self._word_cache._count.get(letter) or 0,
            )

        return ValidatedResult(
            input_ in self._dictionary,
            input_ == self._word_cache._word,
            [validate_letter(letter, index) for index, letter in enumerate(input_)],
        )
