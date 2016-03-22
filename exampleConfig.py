import os, os.path
import cherrypy
   
import sys
print(sys.version)   
   
class AngularTest(object):
    @cherrypy.expose
    def index(self):
        return open('html/index.html')

if __name__ == '__main__':
	
	#cherrypy.config.upate(
    #{'server.socket_host': '0.0.0.0'} )  
	
	HERE = os.path.dirname(os.path.abspath(__file__))
	
	config = {
		'/css': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': os.path.join(HERE, 'css')},
		'/js': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': os.path.join(HERE, 'js')},
		'/images': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': os.path.join(HERE, 'images')}
	}
	
	cherrypy.quickstart(AngularTest(), '/', config)
	