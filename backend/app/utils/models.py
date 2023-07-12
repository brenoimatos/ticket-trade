import importlib
import os
from enum import Enum


class StatusEnum(Enum):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'


# crawler_files = [f[:-3] for f in os.listdir("app/services/crawler") if f.endswith(".py") and f != "base_crawler.py"]
# CrawlerEnum = Enum("CrawlerEnum", {crawler.capitalize(): crawler for crawler in crawler_files})
