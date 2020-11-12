
from scrapy.spiders import XMLFeedSpider
from scholar.items import ScholarItem
from w3lib.html import remove_tags

import datetime

class Spider(XMLFeedSpider):
    name = "computerweekly"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "DNT": "1",
        "Accept-Encoding": "gzip, deflate, sdch",
        "Accept-Language":"en-US,en;q=0.8"
    }

    
    allowed_domains = ["computerweekly.com"]
    start_urls = ['https://www.computerweekly.com/rss/IT-security.xml']    #Crawl BPMX
    itertag = 'item'


    def parse_node(self, response, node):
        # self.logger.info('Hi, this is a <%s> node!: %s', self.itertag, ''.join(node.extract()))
        page = response.url
        
        item = ScholarItem() 
        item['title'] = node.xpath('title/text()',).extract_first()                #define XPath for title
        item['link'] = node.xpath('link/text()').extract_first()
        # determine the description. Field is not always gather the same way for all feeds.
      
        # item['description'] = remove_tags(node.xpath('description/text()').extract_first())                #define XPath for description
        date_time_str = node.xpath('pubDate/text()').extract_first()
        
        
        date_time_str = date_time_str.split(" ")
        date_time_str.pop()
        date_time_str = " ".join(date_time_str)
        self.logger.info('Logged time/date stamp: %s',  date_time_str)
        date_time_obj = datetime.datetime.strptime(date_time_str, '%a, %d %b %Y %H:%M:%S')

        item['pubDate'] = date_time_obj.strftime('%Y/%m/%d')
            
        item['score'] = 0
        item['show'] = 1
        
        # self.logger.info('INFO Spider: url is %s', page )

        if (page.find("computerweekly")>=0): item['source']="Computerweekly"
        item['like'] = 0
        yield item
