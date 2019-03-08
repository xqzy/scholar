
from scrapy.spiders import XMLFeedSpider
from scholar.items import ScholarItem
import datetime

class Spider(XMLFeedSpider):
    name = "secmag"
    allowed_domains = ["securitymagazine.com"]
    start_urls = ('https://www.securitymagazine.com/rss/topic/2246-banking-finance-insurance',)    #Crawl BPMX
    itertag = 'item'

    def parse_node(self, response, node):
        self.logger.info('Hi, this is a <%s> node!: %s', self.itertag, ''.join(node.extract()))

        item = ScholarItem() 
        item['title'] = node.xpath('title/text()',).extract_first()                #define XPath for title
        item['link'] = node.xpath('link/text()').extract_first()
        date_time_str = node.xpath('pubDate/text()').extract_first()
        date_time_str = date_time_str.split(" ")
        date_time_str.pop()
        date_time_str = " ".join(date_time_str)
        print date_time_str
        date_time_obj = datetime.datetime.strptime(date_time_str, '%a, %d %b %Y %H:%M:%S')

        item['pubDate'] = date_time_obj.strftime('%Y/%m/%d')
        item['description'] = node.xpath('description/text()').extract_first()                #define XPath for description
	item['score'] = 0
	item['show'] = 1
        yield item
