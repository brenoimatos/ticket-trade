from datetime import datetime

import pandas as pd
import requests

from app.services.crawler.base_crawler import BaseCrawler


class CrawlerIngresse(BaseCrawler):
    ticket_office = 'ingresse'
    base_api = 'https://event-search.ingresse.com/1?state={location}&from=now&orderBy=sessions.dateTime&size=200&category={category}'
    base_url = 'https://www.ingresse.com/'
    category = [
        'festas-e-baladas',
        'shows-e-festivais'
    ]

    def get_events(self, location: str):
        all_categories_data = [d for category in self.category for d in self._get_data(location, category)['data']['hits']]
        return self._process_data(all_categories_data)

    def _get_data(self, location: str, category: str):
        return requests.get(self.base_api.format(location=location, category=category)).json()
    
    def _process_data(self, raw_data: list[dict]):
        return (
            pd.DataFrame({
                "name": [d['_source']['title'] for d in raw_data],
                "location_city": [d['_source']['place']['city'] for d in raw_data],
                "location_lat": [d['_source']['place']['location']['lat'] for d in raw_data],
                "location_lon": [d['_source']['place']['location']['lon'] for d in raw_data],
                "location_name": [d['_source']['place']['name'] for d in raw_data],
                "location_street": [d['_source']['place']['street'] for d in raw_data],
                "location_zipcode": [d['_source']['place']['zip'] for d in raw_data],
                "date": [[datetime.fromisoformat(x['dateTime']) for x in d['_source']['sessions'] if x['status'] != 'finished'] for d in raw_data],
                "updated_at": [datetime.fromisoformat(d['_source']['updatedAt']) for d in raw_data],
                "categories": [[x['slug'] for x in d['_source']['categories']] for d in raw_data],
                "poster_medium": [d['_source']['poster']['medium'] for d in raw_data],
                "poster_small": [d['_source']['poster']['small'] for d in raw_data],
                "external_ticket_id": [d['_source']['id'] for d in raw_data],
                "ticket_url": [self.base_url + d['_source']['slug'] for d in raw_data],
            })
            .explode('date')
            .reset_index(drop=True)
            .drop_duplicates(subset=['name', 'date'])
        )
        