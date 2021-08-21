Public News Network (PNN) US News Broadcast (CBS, NBC, ABC, FOX) visualization using Sentiment Analysis and D3 - 2003-2015

https://jackstenner.com/project/pnn-sentiment-research

This is just an archive. The website housing the database and xml-rpc feed is no longer active. Visual documentation is at the website above. 

NOTES to myself:
This will return a list of all nodes that are tagged with the tid 25790 (unrest and war):
curl --data '{"tid":"25790"}' --header "Content-Type:application/json" http://emeragency.electracy.org/pnn/taxonomy_term/selectNodes.json

This will return a list of all the categories in the vocabulary with vid 10 (ataxonomy):
curl --data '{"vid":"10"}' --header "Content-Type:application/json" http://emeragency.electracy.org/pnn/taxonomy_vocabulary/getTree.json