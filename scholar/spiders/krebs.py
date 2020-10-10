
from scrapy.spiders import XMLFeedSpider
from scholar.items import ScholarItem
from w3lib.html import remove_tags

import datetime

class Spider(XMLFeedSpider):
    name = "krebs"
    allowed_domains = ["krebsonsecurity.com"]
    start_urls = ['https://krebsonsecurity.com/feed',
                  'https://www.lastwatchdog.com/rss',
                  'https://adam.shostack.org/blog/rss',
                  'https://dankaminsky.com/rss',
                  'https://www.grahamcluley.com/feed',
                  'https://www.hackingarticles.in/rss',
                  'https://marcoramilli.com/rss',
                  'https://www.schneier.com/feed/rss2',
                  'https://danielmiessler.com/feed/',
                  'https://www.darkreading.com/rss_simple.asp',
                  'https://www.infosecblog.org/feed',
                  'https://www.risk.net/feeds/rss/category/risk-management/operational-risk',
                  'https://www.wired.com/category/security/feed',
                  'https://www.techrepublic.com/rssfeeds/topic/security/',
                  'https://www.computerweekly.com/rss/IT-security.xml'
                  
                   ]    #Crawl BPMX
    itertag = 'item'

    def parse_node(self, response, node):
        # self.logger.info('Hi, this is a <%s> node!: %s', self.itertag, ''.join(node.extract()))
        page = response.url
        
        item = ScholarItem() 
        item['title'] = node.xpath('title/text()',).extract_first()                #define XPath for title
        item['link'] = node.xpath('link/text()').extract_first()
        
        
        
        
        
        # determine the description. Field is not always gather the same way for all feeds.
        if (page.find("schneier")>=0): 
            print "#########################Schneier article found"
            item['description'] = remove_tags(node.xpath('summary/text()').extract_first()) 
            date_time_str = node.xpath('published/text()').extract_first()
        else: 
            item['description'] = remove_tags(node.xpath('description/text()').extract_first())                #define XPath for description
            date_time_str = node.xpath('pubDate/text()').extract_first()
        
        
        date_time_str = date_time_str.split(" ")
        date_time_str.pop()
        date_time_str = " ".join(date_time_str)
        print date_time_str
        date_time_obj = datetime.datetime.strptime(date_time_str, '%a, %d %b %Y %H:%M:%S')

        item['pubDate'] = date_time_obj.strftime('%Y/%m/%d')
            
        item['score'] = 0
        item['show'] = 1
        
        # self.logger.info('INFO Spider: url is %s', page )
        if (page.find("krebs")>=0): item['source']="Krebs"
        elif (page.find("watchdog")>=0): item['source']="Watchdog"
        elif (page.find("shostack")>=0): item['source']="Shostack"
        elif (page.find("kaminsky")>=0): item['source']="Kaminsky"
        elif (page.find("cluley")>=0): item['source']="Cluley"
        elif (page.find("hackingarticles")>=0): item['source']="Hacking Articles"
        elif (page.find("marcoramilli")>=0): item['source']="Ramilli"
        elif (page.find("schneier")>=0): item['source']="Schneier"
        elif (page.find("miessler")>=0): item['source']="Miessler"
        elif (page.find("InfosecBlog")>=0): item['source']="InfoSecBlog"
        elif (page.find("darkread")>=0): item['source']="Dark Reading"
        elif (page.find("risk.net")>=0): item['source']="Risk.net"
        elif (page.find("wired")>=0): item['source']="Wired"
        elif (page.find("techrepublic")>=0): item['source']="Techrepublic"
        elif (page.find("computerweekly")>=0): item['source']="Computerweekly"
        item['like'] = 0
        yield item
