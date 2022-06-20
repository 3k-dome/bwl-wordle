from unicodedata import name


class EmptyNameOrPasswordError(Exception):
    def __init__(self) -> None:
        dsc = self.__class__.__name__
        super().__init__(f"{dsc}: Given Username or Password was empty.")


class UserAlreadyExistsError(Exception):
    def __init__(self) -> None:
        dsc = self.__class__.__name__
        super().__init__(f"{dsc}: Given Username is already taken.")


class UserDoesNotExistError(Exception):
    def __init__(self) -> None:
        dsc = self.__class__.__name__
        super().__init__(f"{dsc}: Given Username or Password do not match with any user.")
