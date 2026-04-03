# Provide URI.decode for Ruby versions where it was removed (e.g. Ruby 3.3)
require 'uri'
require 'cgi'

unless URI.respond_to?(:decode)
  module URI
    def self.decode(str)
      CGI.unescape(str.to_s)
    end
  end
end
