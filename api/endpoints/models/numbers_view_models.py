from pydantic import BaseModel, RootModel
from typing import List


class Parallel(BaseModel):
    segmentnr: str
    displayName: str
    fileName: str
    category: str


class Segment(BaseModel):
    segmentnr: str
    parallels: List[Parallel]


class NumbersViewOutput(RootModel[List[Segment]]):
    pass


class MenuItem(BaseModel):
    id: str
    displayName: str


class MenuOutput(RootModel[List[MenuItem]]):
    pass
