import importlib


def get_crawler_instance(crawler: str):
    crawler_module = importlib.import_module(f"app.services.crawler.{crawler.value}")
    crawler_class = getattr(crawler_module, f"Crawler{crawler.name}")
    return crawler_class()