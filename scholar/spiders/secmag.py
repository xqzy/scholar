
from scrapy.spiders import XMLFeedSpider
from scholar.items import ScholarItem

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
        item['pubDate'] = node.xpath('link/pubDate/text()').extract_first()
        item['description'] = node.xpath('description/text()').extract_first()                #define XPath for description
	item['score'] = 0
        yield item
