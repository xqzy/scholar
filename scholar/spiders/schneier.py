
from scrapy.spiders import XMLFeedSpider
from scholar.items import ScholarItem
from w3lib.html import remove_tags

import datetime

class Spider(XMLFeedSpider):
    name = "schneier"
    allowed_domains = ["schneier.com"]
    start_urls = ['https://www.schneier.com/feed']    #Crawl BPMX
    namespaces = [('n', 'http://www.w3.org/2005/Atom')]
    itertag = 'item'
#    iterator = 'xml'


    def parse_node(self, response, node):
        # self.logger.info('Hi, this is a <%s> node!: %s', self.itertag, ''.join(node.extract()))
        print "#########################Schneier article found"
        response.selector.remove_namespaces()
        page = response.url
        
        item = ScholarItem() 
        item['title'] = node.xpath('n:title/text()',).extract_first()                #define XPath for title
        
        # temp remove link (mightbe causing errors)
        
        item['link'] = node.xpath('n:link/@href').extract_first()
        
        # determine the description. Field is not always gather the same way for all feeds.
        print "#########################Schneier article found"
        item['description'] = remove_tags(node.xpath('n:summary/text()').extract_first()) 
        
        # get the right date
        date_time_str = node.xpath('n:published/text()').extract_first()
        date_time_str = date_time_str.split("T")
        date_time_str.pop()
        date_time_str2 = date_time_str[0].split("-")
        date_time_str3 = " ".join(date_time_str2)
        # print date_time_str
        date_time_obj = datetime.datetime.strptime(date_time_str3, '%Y %m %d')

        item['pubDate'] = date_time_obj.strftime('%Y/%m/%d')
        
        item['score'] = 0
        item['show'] = 1
        
        # self.logger.info('INFO Spider: url is %s', page )
        item['source']="Schneier"
        
        item['like'] = 0
        yield item
