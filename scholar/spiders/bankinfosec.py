
from scrapy.spiders import XMLFeedSpider
from scholar.items import ScholarItem
from w3lib.html import remove_tags

import datetime

class Spider(XMLFeedSpider):
    name = "bankinfosec"
    allowed_domains = ["feeds.feedburner.com"]
    start_urls = ['http://feeds.feedburner.com/bankinfosecurity/com']    #Crawl BPMX
    
    #
    
    
    itertag = 'item'

    def parse_node(self, response, node):
        # self.logger.info('Hi, this is a <%s> node!: %s', self.itertag, ''.join(node.extract()))
        page = response.url
    
        # this feed has only one pubdate for all articles....
        date_time_str = node.xpath('/rss/channel/pubDate/text()').extract_first()
        date_time_str = date_time_str.split(" ")
        date_time_str.pop()
        date_time_str = " ".join(date_time_str)
        print date_time_str
        date_time_obj = datetime.datetime.strptime(date_time_str, '%a, %d %b %Y %H:%M:%S')
        pubdatestr = date_time_obj.strftime('%Y/%m/%d')
        
        item = ScholarItem() 
        item['title'] = node.xpath('title/text()',).extract_first()                #define XPath for title
        item['link'] = node.xpath('link/text()').extract_first()
        
        
        # determine the description. Field is not always gather the same way for all feeds.
        #3if (page.find("schneier")>=0): 
        #    print "#########################Schneier article found"
        #    item['description'] = remove_tags(node.xpath('summary/text()').extract_first()) 
        #    date_time_str = node.xpath('published/text()').extract_first()
        #else: 
        item['description'] = remove_tags(node.xpath('description/text()').extract_first())                #define XPath for description
        item['score'] = 0
        item['show'] = 1
        item['pubDate'] = pubdatestr
        
        # self.logger.info('INFO Spider: url is %s', page )
        if (page.find("bankinfo")>=0): item['source']="Bankinfo Security"
        
        item['like'] = 0
        yield item
