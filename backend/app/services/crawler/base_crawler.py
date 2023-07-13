from abc import ABC, abstractmethod

import pandas as pd


class BaseCrawler(ABC):
    @property
    @abstractmethod
    def ticket_office(self):
        pass

    @abstractmethod
    def get_events(self, location: str) -> pd.DataFrame:
        pass



    