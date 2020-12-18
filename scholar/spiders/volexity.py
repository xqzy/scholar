
from scrapy.spiders import XMLFeedSpider
from scholar.items import ScholarItem
from w3lib.html import remove_tags

import datetime

class Spider(XMLFeedSpider):
    name = "volexity"
    allowed_domains = ["volexity.com"]
    start_urls = ['https://www.volexity.com/blog/rss'
                  
                   ]    #Crawl BPMX
    itertag = 'item'

    def parse_node(self, response, node):
        self.logger.debug ('Hi, this is a <%s> node!: %s', self.itertag, ''.join(node.extract()))
        page = response.url
        
        item = ScholarItem() 
        item['title'] = node.xpath('title/text()',).extract_first()                #define XPath for title
        item['link'] = node.xpath('link/text()').extract_first()
        
        
        
        temp = node.xpath('description/text()')
        if (temp):
            item['description'] = temp.extract_first()
        else:
            item['description'] = "N/A"
        
        
        date_time_str = node.xpath('pubDate/text()').extract_first()
        

        date_time_str = date_time_str.split(" ")
        date_time_str.pop()
        date_time_str = " ".join(date_time_str)
        self.logger.info ('Timestamp %s', date_time_str)
        date_time_obj = datetime.datetime.strptime(date_time_str, '%a, %d %b %Y %H:%M:%S')

        item['pubDate'] = date_time_obj.strftime('%Y/%m/%d')
            
        item['score'] = 0
        item['show'] = 1
        
        # self.logger.info('INFO Spider: url is %s', page )

        item['source']="Volexity"
        item['like'] = 0
        yield item
