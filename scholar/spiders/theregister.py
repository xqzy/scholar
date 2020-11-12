
from scrapy.spiders import XMLFeedSpider
from scholar.items import ScholarItem
from w3lib.html import remove_tags

import datetime

class Spider(XMLFeedSpider):
    name = "theregister"
    allowed_domains = ["theregister.com"]
    start_urls = ['https://www.theregister.com/security/headlines.atom']    #Crawl BPMX
    #
    # The register has namespaces file mentioned int he xml, parsing need to follow that way
    #
    namespaces = [('n', 'http://www.w3.org/2005/Atom')]
    itertag = 'n:entry'
    iterator = 'xml'

    def parse_node(self, response, node):
        # self.logger.info('Hi, this is a <%s> node!: %s', self.itertag, ''.join(node.extract()))
        response.selector.remove_namespaces()
        page = response.url
        
        item = ScholarItem() 
        item['title'] = node.xpath('n:title/text()',).extract_first()                #define XPath for title
        item['link'] = node.xpath('n:link/@href').extract_first()
        item['description'] = remove_tags(node.xpath('n:summary/text()').extract_first())                #define XPath for description
        date_time_str = node.xpath('n:updated/text()').extract_first()
                
        item['pubDate'] = date_time_str[:10].replace("-", "/")
            
        item['score'] = 0
        item['show'] = 1
        item['like'] = 0
        self.logger.info('INFO Spider: url is %s', page )

        if (page.find("register")>=0): item['source']="The Register"
        
        yield item
