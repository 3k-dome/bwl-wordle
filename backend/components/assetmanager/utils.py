import json
from pathlib import Path
from typing import Set


def save_asset(asset: Set[str], filepath: Path) -> None:
    with open(filepath, mode="w", encoding="utf_8") as out:
        json.dump(sorted([*asset]), out, indent=4)


def load_asset(filepath: Path) -> Set[str]:
    with open(filepath, mode="r", encoding="utf_8") as out:
        return set(json.load(out))
