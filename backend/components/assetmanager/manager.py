from __future__ import annotations

import logging
import random
from pathlib import Path
from typing import Set

from components.assetmanager.utils import load_asset, save_asset


class AssetManager:
    def __init__(self, asset_dir: Path) -> None:
        self._asset_dir = asset_dir
        self._load_assets()

    def _load_assets(self) -> None:
        self._unused: Set[str] = load_asset(self._asset_dir / "unused.json")
        self._used: Set[str] = load_asset(self._asset_dir / "used.json")
        self._all: Set[str] = load_asset(self._asset_dir / "all.json")
        logging.debug("Loaded assets.")

    def _save_assets(self) -> None:
        save_asset(self._unused, self._asset_dir / "unused.json")
        save_asset(self._used, self._asset_dir / "used.json")
        save_asset(self._all, self._asset_dir / "all.json")
        logging.debug("Saved assets.")

    def get_random_word(self) -> str:
        word = random.choice([*self._unused])
        self._unused.remove(word)
        self._used.add(word)
        return word

    def get_dictionary(self) -> Set[str]:
        return self._all

    def reset_dictionaries(self) -> None:
        self._unused = self._unused | self._used
        self._used = set()
        logging.debug("Reset word dictionaries.")

    def __enter__(self) -> AssetManager:
        return self

    def __exit__(self, *args, **kwargs) -> None:
        self._save_assets()
