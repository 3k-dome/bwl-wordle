from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Set


@dataclass
class GameInfo:
    length: int


@dataclass
class WordCache:
    _word: str
    _set: Set[str] = field(init=False)
    _count: Dict[str, int] = field(init=False)

    def __post_init__(self):
        self._set = set(self._word)
        self._count = {letter: self._word.count(letter) for letter in self._word}


@dataclass
class ValidatedResult:
    is_valid: bool
    is_word: bool
    letters: List[ValidatedLetter]


@dataclass
class ValidatedLetter:
    letter: str
    is_in_word: bool
    is_at_index: bool
    count: int
