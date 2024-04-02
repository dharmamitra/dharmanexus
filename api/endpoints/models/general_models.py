from pydantic import BaseModel
from typing import Optional, Union


class Limits(BaseModel):
    """
    Limits for parallels
    """

    category_include: list = []
    category_exclude: list = []
    file_include: list = []
    file_exclude: list = []


class GeneralInput(BaseModel):
    file_name: str
    score: int = 0
    par_length: int = 0
    limits: Optional[Limits]
    page: int = 0
    sort_method: str = "position"
    folio: str = ""


class FullText(BaseModel):
    text: str
    highlightColor: int
    

class FullNames(BaseModel):
    display_name: str
    text_name: str
    link1: Union[str, None] = None
    link2: Union[str, None] = None
