from pydantic import BaseModel, RootModel
from enum import Enum
from .general_models import GeneralInput


class DownloadData(str, Enum):
    table = "table"
    numbers = "numbers"


class DownloadInput(GeneralInput):
    download_data: DownloadData = DownloadData.table


class DownloadOutput(RootModel[bytes]):
    pass
