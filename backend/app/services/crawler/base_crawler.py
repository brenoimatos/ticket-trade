from abc import ABC, abstractmethod


class BaseCrawler(ABC):
    @property
    @abstractmethod
    def ticket_office(self):
        pass

    @abstractmethod
    def get_events(self, location: str):
        pass



    