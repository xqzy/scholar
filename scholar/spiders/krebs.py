
from scrapy.spiders import XMLFeedSpider
from scholar.items import ScholarItem
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
                  'https://www.schneier.com/blog/atom.xml',
                  'https://danielmiessler.com/feed/',
                  'https://www.infosecblog.org/feed'
                   ]    #Crawl BPMX
    itertag = 'item'

    def parse_node(self, response, node):
        # self.logger.info('Hi, this is a <%s> node!: %s', self.itertag, ''.join(node.extract()))

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
        page = response.url
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
        elif (page.find("infosecblog")>=0): item['source']="InfoSecBlog"
        item['like'] = 0
        yield item
