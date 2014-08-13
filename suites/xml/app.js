/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
describe("xml", function() {
	// some common initialization specific to the xml suite
	function countNodes(node, type) {
		var nodeCount = 0;
		type = "undefined" == typeof type ? null : type;
		for (var i = 0; i < node.childNodes.length; i++) {
			var child = node.childNodes.item(i);
			if (null == type || child.nodeType == type) {
				nodeCount++;
				nodeCount += countNodes(child, type);
			}
		}
		return nodeCount;
	}
	var testSource = {};
	var invalidSource = {};
	var testFiles = [ "soap.xml", "xpath.xml", "nodes.xml", "nodeCount.xml", "cdata.xml", "cdataEntities.xml", "with_dtd.xml", "with_ns.xml", "attrs.xml", "element.xml", "elementNS.xml" ];
	var invalidFiles = [ "mismatched_tag.xml", "no_toplevel.xml", "no_end.xml" ];

	for (var i = 0; i < testFiles.length; i++) {
		testSource[testFiles[i]] = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, testFiles[i]).read().toString();
	}

	for (var i = 0; i < invalidFiles.length; i++) {
		invalidSource[invalidFiles[i]] = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, invalidFiles[i]).read().toString();
	}

	//TIMOB-10350
	it("uppercaseHTTP", function(finish) {
		this.timeout(5000);
		var xhr = Ti.Network.createHTTPClient({
			onload: function() {
				finish();
			}
		});
		xhr.open("GET", "HTTP://www.appcelerator.com:80");
		xhr.send({});
	});

	//TIMOB-9558
	it("xhrcalls", function(finish) {
		var win = Titanium.UI.createWindow();
		var xhr = Titanium.Network.createHTTPClient({
			enableKeepAlive: true
		});
		var readyState = false;
		var errorState = false;
		var loadState = false;
		xhr.onerror = function() {
			errorState = true;
			should(errorState).be.true;
			should(readyState).be.true;
			should(loadState).be.false;
			finish();
		};
		xhr.onreadystatechange = function(e) {
			readyState = true;
		};
		xhr.onload = function(e) {
			if (200 == this.status) loadState = true;
		};
		// xhr.open('GET', "SEE COMMENT FOR URLs");
		xhr.open("GET", "http://www.loreal-finance.com/site/us/contenu/communique_rss.asp?ID_PAGE=810&LG=us");
		xhr.send();
		win.open();
	});

	//TIMOB-9071
	it("getOrCreateAttributeNS", function(finish) {
		var xmlDoc = Ti.XML.parseString('<html><head></head><body><a href="http://appcelerator.com/" /></body></html>');
		var anchor = xmlDoc.getElementsByTagName("a").item(0);
		should(function() {
			anchor.getAttributeNS(null, "href");
		}).not.throw();
		should(function() {
			xmlDoc.createAttributeNS(null, "id");
		}).not.throw();
		finish();
	});

	//TIMOB-8551
	it("ownerDocumentproperty", function(finish) {
		var doc = Ti.XML.parseString('<?xml version="1.0"?><root><test>data</test></root>');
		var e1 = doc.firstChild;
		var e2 = doc.createElement("test");
		if (e1.ownerDocument === e2.ownerDocument) {
			should(e2.ownerDocument).not.be.null;
			finish();
		}
	});

	//TIMOB-5112
	it("getElementsByTagName", function(finish) {
		var win = Titanium.UI.createWindow({
			title: "window"
		});
		var xmlString = "<benny/>";
		var doc = Ti.XML.parseString(xmlString);
		var elem;
		win.addEventListener("focus", function() {
			should(function() {
				elem = doc.getElementsByTagName("mickey").item(0);
			}).not.throw();
			finish();
		});
		win.open();
	});

	it("documentParsing", function(finish) {
		var localSources = testSource;
		var localInvalid = invalidSource;
		// Parse valid documents
		should(function() {
			Ti.XML.parseString(localSources["soap.xml"]);
		}).not.throw();
		should(function() {
			Ti.XML.parseString(localSources["xpath.xml"]);
		}).not.throw();
		should(function() {
			Ti.XML.parseString(localSources["nodes.xml"]);
		}).not.throw();
		should(function() {
			Ti.XML.parseString(localSources["nodeCount.xml"]);
		}).not.throw();
		should(function() {
			Ti.XML.parseString(localSources["cdata.xml"]);
		}).not.throw();
		should(function() {
			Ti.XML.parseString(localSources["cdataEntities.xml"]);
		}).not.throw();
		// Parse empty document - spec specifies that a valid XML doc
		// must have a root element (empty string doesn't)
		should(function() {
			Ti.XML.parseString("");
		}).throw();
		// Parse (some types of) invalid documents
		should(function() {
			Ti.XML.parseString(localInvalid["mismatched_tag.xml"]);
		}).throw();
		should(function() {
			Ti.XML.parseString(localInvalid["no_end.xml"]);
		}).throw();
		should(function() {
			Ti.XML.parseString(localInvalid["no_toplevel.xml"]);
		}).throw();
		finish();
	});

	// These 6 tests are adapted from the KitchenSink xml_dom test
	it("soap", function(finish) {
		var xml = Ti.XML.parseString(testSource["soap.xml"]);
		var fooBarList = xml.documentElement.getElementsByTagName("FooBar");
		should(fooBarList).not.be.null;
		should(fooBarList.length).eql(1);
		should(fooBarList.item(0)).be.an.Object;
		var item = fooBarList.item(0);
		should(item.text).eql("true");
		should(item.textContent).eql("true");
		should(item.nodeName).eql("FooBar");
		finish();
	});

	it("xpath", function(finish) {
		var xml = Ti.XML.parseString(testSource["xpath.xml"]);
		var fooBarList = xml.documentElement.getElementsByTagName("FooBar");
		should(fooBarList).not.be.null;
		should(fooBarList.length).eql(1);
		should(fooBarList.item(0)).be.an.Object;
		var item = fooBarList.item(0);
		should(item.text).eql("true");
		should(item.textContent).eql("true");
		should(item.nodeName).eql("FooBar");
		// test XPath against Document
		var docResult = xml.evaluate("//FooBar/text()");
		should(docResult).not.be.null;
		should(docResult.length).eql(1);
		should(docResult.item(0).nodeValue).eql("true");
		// test XPath against Element
		var elResult = xml.documentElement.evaluate("//FooBar/text()");
		should(elResult).not.be.null;
		should(elResult.length).eql(1);
		should(elResult.item(0).nodeValue).eql("true");
		// test XPath against Element
		elResult = item.evaluate("text()");
		should(elResult).not.be.null;
		should(elResult.length).eql(1);
		should(elResult.item(0).nodeValue).eql("true");
		finish();
	});

	it("xmlNodes", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var nodesList = doc.getElementsByTagName("nodes");
		should(nodesList).not.be.null;
		should(nodesList.length).eql(1);
		var nodes = nodesList.item(0);
		var elements = nodes.getElementsByTagName("node");
		should(elements).not.be.null;
		should(elements.length).eql(13);
		var children = nodes.childNodes;
		should(children).not.be.null;
		should(children).be.an.Object;
		should(countNodes(elements.item(0), 1)).eql(6);
		should(children.item).be.a.Function;
		elements = doc.firstChild.childNodes;
		should(elements).not.be.null;
		should(countNodes(nodes, 1)).eql(13);
		should(nodes.nodeName).eql("nodes");
		should(doc.documentElement.nodeName).eql("response");
		should(nodes.getAttribute("id"));
		var node = nodes.getElementsByTagName("node").item(0);
		should(node.getAttribute("id")).eql("node 1");
		var subnodes = node.getElementsByTagName("node");
		should(subnodes.item(0).getAttribute("id")).eql("node 2");
		finish();
	});

	it("xmlNodeCount", function(finish) {
		var xml = Ti.XML.parseString(testSource["nodeCount.xml"]);
		var oneList = xml.documentElement.getElementsByTagName("one");
		var twoList = oneList.item(0).getElementsByTagName("two");
		var threeList = oneList.item(0).getElementsByTagName("three");
		var nodes = xml.getElementsByTagName("root");
		should(oneList.length).eql(1);
		should(twoList.length).eql(2);
		should(threeList.length).eql(4);
		var one = xml.documentElement.getElementsByTagName("one").item(0);
		var next = one.nextSibling;
		for (;null != next && next.nodeType != next.ELEMENT_NODE; ) next = next.nextSibling;
		should(one).not.be.null;
		should(next).not.be.null;
		should(one.nodeName).eql("one");
		should(xml.documentElement.attributes.getNamedItem("id").nodeValue).eql("here");
		should(next.getAttribute("id")).eql("bar");
		should(one.ownerDocument.documentElement.nodeName).eql(xml.documentElement.ownerDocument.documentElement.nodeName);
		var nodeCount = countNodes(nodes.item(0), 1);
		should(nodeCount).eql(8);
		finish();
	});

	it("xmlCData", function(finish) {
		var xml = Ti.XML.parseString(testSource["cdata.xml"]);
		var scriptList = xml.documentElement.getElementsByTagName("script");
		should(scriptList.length).eql(1);
		should(xml.documentElement.nodeName).eql("root");
		var nodeCount = countNodes(xml.documentElement, 1);
		should(nodeCount).eql(1);
		var script = scriptList.item(0);
		var cData;
		for (i = 0; i < script.childNodes.length; i++) {
			var node = script.childNodes.item(i);
			if (node.nodeType == node.CDATA_SECTION_NODE) {
				cData = node;
				break;
			}
		}
		should(cData).not.be.null;
		//CharacterDataAttributes
		var fullString = cData.data;
		should(fullString).eql("\nfunction matchwo(a,b)\n{\nif (a < b && a < 0) then\n  {\n  return 1;\n  }\nelse\n  {\n  return 0;\n  }\n}\n");
		cData.data = "Test Assignment";
		should(cData.data).eql("Test Assignment");
		cData.data = fullString;
		var fullLength = cData.length;
		should(fullLength).eql(fullString.length);
		// CharacterData.substringData
		var substring1 = cData.substringData(1, 8);
		should(substring1).eql(fullString.substr(1, 8));
		// asking for more than there is should not throw exception
		// according to spec, rather just return up to end.
		var substring2 = null;
		should(function() {
			substring2 = cData.substringData(1, 1e3);
		}).not.throw();
		should(substring2.length).eql(fullLength - 1);
		should(substring2).eql(fullString.substr(1, 1e3));
		// check edge cases
		substring2 = cData.substringData(0, fullLength);
		should(substring2.length).eql(fullLength);
		should(substring2).eql(fullString);
		substring2 = cData.substringData(1, fullLength);
		should(substring2.length).eql(fullLength - 1);
		should(substring2).eql(fullString.substr(1, fullLength));
		substring2 = cData.substringData(0, fullLength + 1);
		should(substring2.length).eql(fullLength);
		should(substring2).eql(fullString.substr(0, fullLength + 1));
		should(function() {
			var substring3 = cData.substringData(1e3, 1001);
		}).throw();
		should(function() {
			var substring4 = cData.substringData(-1, 101);
		}).throw();
		should(function() {
			var substring5 = cData.substringData(0, -1);
		}).throw();
		//CharacterData.appendData
		var cDataLength = cData.length;
		cData.appendData("Appending");
		var substring6 = cData.substringData(97, 9);
		should(cData.length).eql(cDataLength + 9);
		should(substring6).eql("Appending");
		should(function() {
			script.appendData("ReadOnly");
		}).throw();
		//CharacterData.insertData
		cData.insertData(9, "InsertData");
		var substring7 = cData.substringData(9, 10);
		should(substring7).eql("InsertData");
		should(function() {
			cData.insertData(-1, "InsertFail");
		}).throw();
		should(function() {
			cData.insertData(1e3, "InsertFail");
		}).throw();
		should(function() {
			script.insertData(1, "ReadOnly");
		}).throw();
		//CharacterData.replaceData
		cData.replaceData(9, 1, "ReplaceData");
		var substring8 = cData.substringData(9, 20);
		should(substring8).eql("ReplaceDatansertData");
		cDataLength = cData.length;
		cData.replaceData(cDataLength, 100, "ReplaceData");
		should(cData.length).eql(cDataLength + 11);
		should(function() {
			cData.replaceDate(-1, 2, "Failure");
		}).throw();
		cDataLength = cData.length;
		should(function() {
			cData.replaceDate(cDataLength + 1, 2, "Failure");
		}).throw();
		should(function() {
			cData.replaceDate(1, -1, "Failure");
		}).throw();
		//CharacterData.deleteData
		cDataLength = cData.length;
		cData.deleteData(1, 8);
		should(cData.length).eql(cDataLength - 8);
		should(function() {
			cData.deleteData(-1, 10);
		}).throw();
		should(function() {
			cData.deleteData(1e3, 1001);
		}).throw();
		should(function() {
			cData.deleteData(0, -1);
		}).throw();
		cData.deleteData(1, 1e3);
		should(cData.length).eql(1);
		should(function() {
			script.deleteData(0, 1);
		}).throw();
		finish();
	});

	it("xmlCDataAndEntities", function(finish) {
		var xml = Ti.XML.parseString(testSource["cdataEntities.xml"]);
		var dataList = xml.documentElement.getElementsByTagName("data");
		var subdataList = xml.documentElement.getElementsByTagName("subdata");
		should(xml.documentElement.firstChild.nodeName).eql("subdata");
		var nodeCount = countNodes(subdataList.item(0), 1);
		should(nodeCount).eql(2);
		finish();
	});

	it("xmlSerialize", function(finish) {
		// Return an array of attribute nodes, sorted by name.
		// An attribute NamedNodeMap has no canonical ordering,
		// so to do a comparison we need to ensure we've got the
		// same order between both.
		function sortAttributeList(attribs) {
			var names = [];
			var map = {};
			for (var i = 0; attribs > i; i++) {
				var a = attribs.item(i);
				map[a.nodeName] = a;
				names.push(a.nodeName);
			}
			names = names.sort();
			var list = [];
			for (var i = 0; i < names.length; i++) list.push(map[names[i]]);
			return list;
		}
		function matchXmlTrees(a, b) {
			should(a.nodeType).eql(b.nodeType);
			should(a.nodeName).eql(b.nodeName);
			should(a.nodeValue).eql(b.nodeValue);
			if (1 == a.nodeType) {
				var aAttribs = sortAttributeList(a.attributes);
				var bAttribs = sortAttributeList(b.attributes);
				should(aAttribs.length).eql(bAttribs.length);
				for (var i = 0; i < aAttribs.length; i++) matchXmlTrees(aAttribs[i], bAttribs[i]);
				var aChildren = a.childNodes;
				var bChildren = b.childNodes;
				should(aChildren.length).eql(bChildren.length);
				for (var i = 0; i < aChildren.length; i++) matchXmlTrees(aChildren.item(i), bChildren.item(i));
			}
		}
		for (var sourceName in testSource) {
			var a = Ti.XML.parseString(testSource[sourceName]);
			var bstr = Ti.XML.serializeToString(a);
			var b = Ti.XML.parseString(bstr);
			// Make sure we can round-trip from source to DOM to source and back to DOM...
			matchXmlTrees(a, b);
		}
		finish();
	});

	it("apiXMLTextSplitText", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var firstString = "first part|";
		var secondString = "second part";
		var completeString = firstString + secondString;
		should(doc.createTextNode).be.a.Function;
		var parentNode = doc.createElement("parentNode");
		var childNode = doc.createTextNode(completeString);
		parentNode.appendChild(childNode);
		should(parentNode.childNodes.length).eql(1);
		should(function() {
			splitTextResults = parentNode.firstChild.splitText(firstString.length);
		}).not.throw();
		should(parentNode.childNodes.length).eql(2);
		should(splitTextResults.nodeValue).eql(parentNode.lastChild.nodeValue);
		should(firstString).eql(parentNode.firstChild.nodeValue);
		should(secondString).eql(parentNode.lastChild.nodeValue);
		// Out-of-bounds exceptions are in the spec:
		completeString = "New text node";
		childNode = doc.createTextNode(completeString);
		should(function() {
			childNode.splitText(-1);
		}).throw();
		should(function() {
			childNode.splitText(completeString.length + 1);
		}).throw();
		finish();
	});

	it("apiXMLTextGetText", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var textValue = "this is some test";
		should(doc.createTextNode).be.a.Function;
		var textNode = doc.createTextNode(textValue);
		should(textNode.nodeValue).eql(textValue);
		var getTextResults = null;
		should(function() {
			getTextResults = textNode.getText();
		}).not.throw();
		should(getTextResults).eql(textValue);
		should(function() {
			getTextResults = textNode.getTextContent();
		}).not.throw();
		should(getTextResults).eql(textValue);
		should(function() {
			getTextResults2 = textNode.text;
		}).not.throw();
		should(getTextResults2).eql(textValue);
		should(function() {
			getTextResults2 = textNode.textContent;
		}).not.throw();
		should(getTextResults2).eql(textValue);
		finish();
	});

	it("apiXmlDocumentProperties", function(finish) {
		// File with DTD
		var doc = Ti.XML.parseString(testSource["with_dtd.xml"]);
		should(doc.documentElement).not.be.type("undefined");
		should(doc.documentElement).not.be.null;
		should(doc.documentElement).be.an.Object;
		should(doc.documentElement.nodeName).eql("letter");
		should(doc.implementation).not.be.type("undefined");
		should(doc.implementation).not.be.null;
		should(doc.implementation).be.an.Object;
		should(doc.doctype).not.be.type("undefined");
		should(doc.doctype).not.be.null;
		should(doc.doctype).be.an.Object;
		// Document without DTD, to be sure doc.doctype is null as spec says
		doc = Ti.XML.parseString("<a/>");
		should(doc.doctype).be.null;
		finish();
	});

	it("apiXmlDocumentCreateAttribute", function(finish) {
		var doc = Ti.XML.parseString("<test/>");
		should(doc.createAttribute).be.a.Function;
		var attr = doc.createAttribute("myattr");
		should(attr).not.be.null;
		should(attr).be.an.Object;
		should(attr.name).eql("myattr");
		// Per spec, value in new attribute should be empty string
		should(attr.value).not.be.null;
		should(attr.value).be.equal("");
		should(attr.ownerDocument).eql(doc);
		attr = null;
		should(doc.createAttributeNS).be.a.Function;
		attr = doc.createAttributeNS("http://example.com", "prefix:myattr");
		should(attr).not.be.null;
		should(attr).be.an.Object;
		should(attr.name).eql("prefix:myattr");
		should(attr.namespaceURI).eql("http://example.com");
		should(attr.prefix).eql("prefix");
		should(attr.value).not.be.null;
		should(attr.value).be.equal("");
		should(attr.ownerDocument).eql(doc);
		finish();
	});

	it("apiXmlDocumentCreateCDATASection", function(finish) {
		var doc = Ti.XML.parseString("<test/>");
		should(doc.createCDATASection).be.a.Function;
		var data = "This is my CDATA section";
		var section = doc.createCDATASection(data);
		should(section).not.be.null;
		should(section).be.an.Object;
		should(section.text).eql(data);
		should(section.textContent).eql(data);
		should(section.ownerDocument).eql(doc);
		finish();
	});

	it("apiXmlDocumentCreateComment", function(finish) {
		var doc = Ti.XML.parseString("<test/>");
		should(doc.createComment).be.a.Function;
		var data = "This is my comment";
		var comment = doc.createComment(data);
		should(comment).not.be.null;
		should(comment).be.an.Object;
		should(comment.data).eql(data);
		should(comment.ownerDocument).eql(doc);
		finish();
	});

	it("apiXmlDocumentCreateDocumentFragment", function(finish) {
		var doc = Ti.XML.parseString("<test/>");
		should(doc.createDocumentFragment).be.a.Function;
		var frag = doc.createDocumentFragment();
		should(frag).not.be.null;
		should(frag).be.an.Object;
		should(frag.ownerDocument).eql(doc);
		finish();
	});

	it("apiXmlDocumentCreateElement", function(finish) {
		var doc = Ti.XML.parseString("<test/>");
		should(doc.createElement).be.a.Function;
		var elem = doc.createElement("myelement");
		should(elem).not.be.null;
		should(elem).be.an.Object;
		should(elem.nodeName).eql("myelement");
		should(elem.localName).be.null;
		should(elem.prefix).be.null;
		should(elem.namespaceURI).be.null;
		should(elem.ownerDocument).eql(doc);
		finish();
	});

	it("apiXmlDocumentCreateElementNS", function(finish) {
		var doc = Ti.XML.parseString("<test/>");
		should(doc.createElementNS).be.a.Function;
		var elem = doc.createElementNS("http://example.com", "prefix:myelement");
		should(elem).not.be.null;
		should(elem).be.an.Object;
		should(elem.nodeName).eql("prefix:myelement");
		should(elem.localName).eql("myelement");
		should(elem.prefix).eql("prefix");
		should(elem.namespaceURI).eql("http://example.com");
		should(elem.ownerDocument).eql(doc);
		finish();
	});

	it("apiXmlDocumentCreateEntityReference", function(finish) {
		var doc = Ti.XML.parseString("<test/>");
		should(doc.createEntityReference).be.a.Function;
		var entity = doc.createEntityReference("myentity");
		should(entity).not.be.null;
		should(entity).be.an.Object;
		should(entity.nodeName).eql("myentity");
		should(entity.ownerDocument).eql(doc);
		finish();
	});

	it("apiXmlDocumentCreateProcessingInstruction", function(finish) {
		var doc = Ti.XML.parseString("<test/>");
		should(doc.createProcessingInstruction).be.a.Function;
		var instruction = doc.createProcessingInstruction("a", "b");
		should(instruction).not.be.null;
		should(instruction).be.an.Object;
		should(instruction.target).eql("a");
		should(instruction.data).eql("b");
		should(instruction.ownerDocument).eql(doc);
		finish();
	});

	it("apiXmlDocumentCreateTextNode", function(finish) {
		var doc = Ti.XML.parseString("<test/>");
		should(doc.createTextNode).be.a.Function;
		var value = "This is some text";
		var text = doc.createTextNode(value);
		should(text).not.be.null;
		should(text).be.an.Object;
		should(text.data).eql(value);
		should(text.ownerDocument).eql(doc);
		finish();
	});

	it("apiXmlDocumentGetElementById", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		should(doc.getElementById).be.a.Function;
		var node = doc.getElementById("node 1");
		should(node).not.be.null;
		should(node).be.an.Object;
		should(node.nodeName).eql("node");
		should(function() {
			node = doc.getElementById("no_such_element");
		}).not.throw();
		should(node).be.null;
		finish();
	});

	it("apiXmlDocumentGetElementsByTagName", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		should(doc.getElementsByTagName).be.a.Function;
		var elements = doc.getElementsByTagName("node");
		should(elements).not.be.null;
		should(elements).be.an.Object;
		should(elements.length).be.greaterThan(0);
		for (var i = 0; i < elements.length; i++) {
			var checkelem = elements.item(i);
			should(checkelem.nodeName).eql("node");
		}
		// test bogus tagname
		should(function() {
			elements = doc.getElementsByTagName("bogus");
		}).not.throw();
		should(elements).not.be.null;
		should(elements).be.an.Object;
		should(elements.length).be.equal(0);
		finish();
	});

	it("apiXmlDocumentGetElementsByTagNameNS", function(finish) {
		var doc = Ti.XML.parseString(testSource["with_ns.xml"]);
		should(doc.getElementsByTagNameNS).be.a.Function;
		var elements = doc.getElementsByTagNameNS("http://example.com", "cake");
		should(elements).not.be.null;
		should(elements).be.an.Object;
		should(elements.length).be.greaterThan(0);
		for (var i = 0; i < elements.length; i++) {
			var checkelem = elements.item(i);
			should(checkelem.localName).eql("cake");
			should(checkelem.namespaceURI).eql("http://example.com");
		}
		// test real namespace and bogus tagname
		should(function() {
			elements = doc.getElementsByTagNameNS("http://example.com", "bogus");
		}).not.throw();
		should(elements).not.be.null;
		should(elements).be.an.Object;
		should(elements.length).be.equal(0);
		// test bogus namespace and real tagname
		should(function() {
			elements = doc.getElementsByTagNameNS("http://bogus.com", "pie");
		}).not.throw();
		should(elements).not.be.null;
		should(elements).be.an.Object;
		should(elements.length).be.equal(0);
		// test bogus namespace and bogus tagname
		should(function() {
			elements = doc.getElementsByTagNameNS("http://bogus.com", "bogus");
		}).not.throw();
		should(elements).not.be.null;
		should(elements).be.an.Object;
		should(elements.length).be.equal(0);
		finish();
	});

	it("apiXmlDocumentImportNode", function(finish) {
		var doc = Ti.XML.parseString("<a/>");
		var otherDoc = Ti.XML.parseString(testSource["with_ns.xml"]);
		var cakeNodes = otherDoc.documentElement.getElementsByTagNameNS("http://example.com", "cake");
		should(cakeNodes).not.be.null;
		should(cakeNodes.length).be.greaterThan(0);
		var cakeNode = cakeNodes.item(0);
		should(cakeNode).not.be.null;
		should(doc.importNode).be.a.Function;
		// test deep import
		var importedNode;
		should(function() {
			importedNode = doc.importNode(cakeNode, true);
		}).not.throw();
		should(importedNode.ownerDocument).not.be.null;
		should(importedNode.ownerDocument).be.an.Object;
		should(importedNode.ownerDocument).eql(doc);
		should(importedNode.parentNode).be.null;
		should(importedNode.hasChildNodes()).be.true;
		should(importedNode.childNodes.length).be.greaterThan(0);
		should(importedNode.namespaceURI).eql("http://example.com");
		// test shallow import
		should(function() {
			importedNode = doc.importNode(cakeNode, false);
		}).not.throw();
		should(importedNode.hasChildNodes()).be.false;
		should(importedNode.ownerDocument).not.be.null;
		should(importedNode.ownerDocument).be.an.Object;
		should(importedNode.ownerDocument).eql(doc);
		should(importedNode.parentNode).be.null;
		finish();
	});

	it("apiXmlNodeProperties", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var nodesList = doc.getElementsByTagName("nodes");
		should(nodesList).not.be.null;
		should(nodesList.length).eql(1);
		var node = nodesList.item(0);
		// verify properties
		should(node.ELEMENT_NODE).be.a.Number;
		should(node.ATTRIBUTE_NODE).be.a.Number;
		should(node.TEXT_NODE).be.a.Number;
		should(node.CDATA_SECTION_NODE).be.a.Number;
		should(node.ENTITY_REFERENCE_NODE).be.a.Number;
		should(node.ENTITY_NODE).be.a.Number;
		should(node.PROCESSING_INSTRUCTION_NODE).be.a.Number;
		should(node.COMMENT_NODE).be.a.Number;
		should(node.DOCUMENT_NODE).be.a.Number;
		should(node.DOCUMENT_TYPE_NODE).be.a.Number;
		should(node.DOCUMENT_FRAGMENT_NODE).be.a.Number;
		should(node.NOTATION_NODE).be.a.Number;
		should(node.nodeName).be.a.String;
		var attrName = "attr";
		var attrValue = "value";
		node.setAttribute(attrName, attrValue);
		var attrNode = node.getAttributeNode(attrName);
		should(attrNode.nodeValue).eql(attrValue);
		var CDATANodeContents = "this CDATA contents";
		var CDATANode = doc.createCDATASection(CDATANodeContents);
		should(CDATANode.nodeValue).eql(CDATANodeContents);
		var commentNodeContents = "this is a comment";
		var commentNode = doc.createComment(commentNodeContents);
		should(commentNode.nodeValue).eql(commentNodeContents);
		should(doc.nodeValue).eql(null);
		should(doc.createDocumentFragment().nodeValue).eql(null);
		should(doc.getDoctype().nodeValue).eql(null);
		should(node.nodeValue).eql(null);
		should(doc.createEntityReference("blah").nodeValue).eql(null);
		var processingInstructionData = "data";
		should(doc.createProcessingInstruction("target", processingInstructionData).nodeValue).eql(processingInstructionData);
		var textNodeContents = "this is some text";
		var textNode = doc.createTextNode(textNodeContents);
		should(textNode.nodeValue).eql(textNodeContents);
		should(node.nodeType).be.a.Number;
		should(node.parentNode).be.an.Object;
		should(node.childNodes).be.an.Object;
		should(node.firstChild).be.an.Object;
		should(node.lastChild).be.an.Object;
		should(node.previousSibling).be.an.Object;
		should(node.nextSibling).be.an.Object;
		should(node.attributes).be.an.Object;
		should(node.ownerDocument).be.an.Object;
		should(node.namespaceURI).not.be.type("undefined");
		should(node.prefix).not.be.type("undefined");
		should(node.localName).not.be.type("undefined");
		finish();
	});

	it("apiXmlNodeAppendChild", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var parentNode = doc.createElement("parentNode");
		should(parentNode.appendChild).be.a.Function;
		var childNode = doc.createElement("childNode");
		should(function() {
			parentNode.appendChild(childNode);
		}).not.throw();
		should(parentNode.firstChild).eql(childNode);
		finish();
	});

	it("apiXmlNodeCloneNode", function(finish) {
		var shouldRun = true;
		if ("android" === Ti.Platform.osname) {
			// this check exists to deal with the bug mentioned in TIMOB-4771
			should(isNaN(parseInt(Ti.Platform.version))).be.false;
			if (parseInt(Ti.Platform.version) < 3) {
				Ti.API.info("Less than 3.0, not running apiXmlNodeCloneNode test");
				shouldRun = false;
			} else Ti.API.info("3.0 or greater, running apiXmlNodeCloneNode test");
		}
		if (shouldRun) {
			var doc = Ti.XML.parseString(testSource["nodes.xml"]);
			var parentNode = doc.createElement("parent");
			parentNode.setAttribute("myattr", "attr value");
			var childText = doc.createTextNode("child text");
			var childElement = doc.createElement("childelement");
			parentNode.appendChild(childText);
			parentNode.appendChild(childElement);
			should(parentNode.cloneNode).be.a.Function;
			var clonedNode = null;
			// Shallow
			should(function() {
				clonedNode = parentNode.cloneNode(false);
			}).not.throw();
			should(clonedNode.nodeName).eql(parentNode.nodeName);
			// Though shallow, attributes should be there.
			var attrs = clonedNode.attributes;
			should(attrs).not.be.null;
			should(attrs.length).be.equal(1);
			var attr = attrs.getNamedItem("myattr");
			should(attr).not.be.null;
			should(attr.nodeValue).be.equal("attr value");
			// Fetch a different way
			var attrValue = clonedNode.getAttribute("myattr");
			should(attrValue).not.be.null;
			should(attrValue).be.equal("attr value");
			// Per spec, clone should have no parent and no children
			should(clonedNode.parentNode).be.null;
			should(clonedNode.hasChildNodes()).be.Boolean;
			should(clonedNode.hasChildNodes()).be.false;
			// Deep
			should(function() {
				clonedNode = parentNode.cloneNode(true);
			}).not.throw();
			should(clonedNode.nodeName).eql(parentNode.nodeName);
			should(clonedNode.parentNode).be.null;
			attrs = clonedNode.attributes;
			should(attrs).not.be.null;
			should(attrs.length).be.equal(1);
			attr = attrs.getNamedItem("myattr");
			should(attr).not.be.null;
			should(attr.nodeValue).be.equal("attr value");
			should(clonedNode.getAttribute("myattr")).eql("attr value");
			attrValue = clonedNode.getAttribute("myattr");
			should(attrValue).not.be.null;
			should(attrValue).be.equal("attr value");
			// this one should have children since it's deep.
			should(clonedNode.hasChildNodes()).be.Boolean;
			should(clonedNode.hasChildNodes()).be.true;
			should(clonedNode.firstChild).not.be.null;
			should(clonedNode.firstChild.nodeValue).eql(parentNode.firstChild.nodeValue);
			should(clonedNode.lastChild).not.be.null;
			should(clonedNode.lastChild.nodeName).eql(parentNode.lastChild.nodeName);
		}
		finish();
	});

	it("apiXmlNodeHasAttributes", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var node = doc.createElement("node");
		var node2 = doc.createElement("node2");
		node2.setAttribute("attr1", "value1");
		should(node.hasAttributes).be.a.Function;
		var results;
		should(function() {
			results = node.hasAttributes();
		}).not.throw();
		should(results).eql(false);
		should(function() {
			results = node2.hasAttributes();
		}).not.throw();
		should(results).eql(true);
		finish();
	});

	it("apiXmlNodeHasChildNodes", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var parentNode = doc.createElement("parentNode");
		var parentNode2 = doc.createElement("parentNode2");
		parentNode2.appendChild(doc.createElement("childNode"));
		should(parentNode.hasChildNodes).be.a.Function;
		var results;
		should(function() {
			results = parentNode.hasChildNodes();
		}).not.throw();
		should(results).eql(false);
		should(function() {
			results = parentNode2.hasChildNodes();
		}).not.throw();
		should(results).eql(true);
		finish();
	});

	it("apiXmlNodeInsertBefore", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var parentNode = doc.createElement("parentNode");
		parentNode.appendChild(doc.createElement("childNode"));
		parentNode.appendChild(doc.createElement("childNode2"));
		should(parentNode.insertBefore).be.a.Function;
		var childNode3 = doc.createElement("childNode3");
		should(function() {
			parentNode.insertBefore(childNode3, parentNode.firstChild);
		}).not.throw();
		should(parentNode.firstChild).eql(childNode3);
		finish();
	});

	it("apiXmlNodeIsSupported", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		should(doc.isSupported).be.a.Function;
		var results;
		should(function() {
			results = doc.isSupported("XML", "1.0");
		}).not.throw();
		should(results).eql(true);
		should(function() {
			results = doc.isSupported("IDONTEXIST", "1.0");
		}).not.throw();
		should(results).eql(false);
		finish();
	});

	it("apiXmlNodeNormalize", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var parentNode = doc.createElement("parentNode");
		parentNode.appendChild(doc.createTextNode("My "));
		parentNode.appendChild(doc.createTextNode("name "));
		parentNode.appendChild(doc.createTextNode("is "));
		parentNode.appendChild(doc.createTextNode("Opie."));
		should(parentNode.normalize).be.a.Function;
		should(function() {
			parentNode.normalize();
		}).not.throw();
		should(parentNode.getText()).eql("My name is Opie.");
		should(parentNode.getTextContent()).eql("My name is Opie.");
		should(parentNode.getChildNodes().length).eql(1);
		finish();
	});

	it("apiXmlNodeRemoveChild", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var parentNode = doc.createElement("parentNode");
		var childNode = doc.createElement("childNode");
		parentNode.appendChild(childNode);
		should(parentNode.removeChild).be.a.Function;
		var results = null;
		should(function() {
			results = parentNode.removeChild(childNode);
		}).not.throw();
		should(results).eql(childNode);
		should(parentNode.hasChildNodes()).eql(false);
		finish();
	});

	it("apiXmlNodeReplaceChild", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var parentNode = doc.createElement("parentNode");
		var childNode = doc.createElement("childNode");
		var childNode2 = doc.createElement("childNode2");
		parentNode.appendChild(childNode);
		parentNode.appendChild(childNode2);
		should(parentNode.replaceChild).be.a.Function;
		var replacementNode = doc.createElement("replacementNode");
		should(function() {
			parentNode.replaceChild(replacementNode, childNode);
		}).not.throw();
		should(parentNode.firstChild).eql(replacementNode);
		finish();
	});

	it("xmlNodeListElementsByTagName", function(finish) {
		var xml = Ti.XML.parseString(testSource["nodes.xml"]);
		should(xml).not.be.null;
		var nodes = xml.getElementsByTagName("node");
		should(nodes).not.be.null;
		should(nodes.length).be.a.Number;
		should(nodes.item).be.a.Function;
		should(nodes.length).eql(13);
		var n = nodes.item(0);
		should(n).not.be.null;
		should(n.getAttribute("id")).eql("node 1");
		n = nodes.item(1);
		should(n).not.be.null;
		should(n.getAttribute("id")).eql("node 2");
		finish();
	});

	it("xmlNodeListChildren", function(finish) {
		var xml = Ti.XML.parseString(testSource["nodes.xml"]);
		should(xml).not.be.null;
		var e = xml.documentElement;
		should(e).not.be.null;
		var nodes = e.childNodes;
		should(nodes).not.be.null;
		var count = 0;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes.item(i);
			if (node.nodeType == node.ELEMENT_NODE) count++;
		}
		should(count).eql(1);
		finish();
	});

	it("xmlNodeListRange", function(finish) {
		var xml = Ti.XML.parseString(testSource["nodes.xml"]);
		should(xml).not.be.null;
		var nodes = xml.getElementsByTagName("node");
		should(nodes.item(nodes.length)).be.null;
		should(nodes.item(100)).be.null;
		finish();
	});

	it("apiXmlAttr", function(finish) {
		var doc = Ti.XML.parseString(testSource["nodes.xml"]);
		var node = doc.getElementsByTagName("node").item(0);
		var attr;
		// First a known attribute
		should(function() {
			attr = node.attributes.item(0);
		}).not.throw();
		should(attr).not.be.type("undefined");
		should(attr).not.be.null;
		should(attr).be.an.Object;
		should(attr.name).be.a.String;
		should(attr.name).eql("id");
		should(attr.ownerElement).be.an.Object;
		should(attr.ownerElement).eql(node);
		should(attr.specified).be.Boolean;
		should(attr.specified).be.true;
		should(attr.value).be.a.String;
		should(attr.value).eql("node 1");
		// Now new attribute
		should(function() {
			attr = doc.createAttribute("newattr");
		}).not.throw();
		should(attr).not.be.type("undefined");
		should(attr).not.be.null;
		should(attr).be.an.Object;
		should(attr.name).be.a.String;
		should(attr.name).eql("newattr");
		should(attr.specified).be.Boolean;
		// Per spec, the default value in an attribute is empty string not null.
		should(attr.value).not.be.null;
		should(attr.value).be.equal("");
		// Per spec, when you set an attribute that doesn't exist yet,
		// null is returned.
		var addedAttr = node.setAttributeNode(attr);
		should(addedAttr).be.null;
		should(attr.ownerElement).not.be.null;
		should(attr.ownerElement).eql(node);
		// Per spec, when you set a new attribute of same name as one that
		// already exists, it replaces that existing one AND returns that existing one.
		var secondNewAttr = doc.createAttribute("newattr");
		var replacedAttr = node.setAttributeNode(secondNewAttr);
		should(replacedAttr).not.be.null;
		should(replacedAttr).eql(attr);
		// Per spec, changing the value of an attribute automatically sets
		// specified to true.
		attr.value = "new value";
		should(attr.value).not.be.null;
		should(attr.value).eql("new value");
		should(attr.specified).be.Boolean;
		should(attr.specified).be.true;
		// Per spec, an attribute with no owner element (i.e., it has just
		// been created and not yet put on to an element) will have
		// "true" for specified.
		var thirdNewAttr = doc.createAttribute("anotherattr");
		should(thirdNewAttr).not.be.null;
		should(thirdNewAttr.ownerElement).be.null;
		should(thirdNewAttr.specified).be.Boolean;
		should(thirdNewAttr.specified).be.true;
		finish();
	});

	it("xmlNamedNodeMap", function(finish) {
		var xml = Ti.XML.parseString(testSource["attrs.xml"]);
		var otherDoc = Ti.XML.parseString("<dummy/>");
		var doc = xml.documentElement;
		should(doc.nodeName).eql("doc");
/*		var nodes = doc.getElementsByTagName("test");
		should(nodes.length).eql(1);
		var test = nodes.item(0);
		should(test).not.be.null;
		nodes = test.getElementsByTagNameNS("http://www.test.com/namespace", "child");
		should(nodes.length).eql(1);
		var child = nodes.item(0);
		should(child).not.be.null;
		var attrs = test.attributes;
		// length
		should(attrs.length).eql(3);
		// item
		var item0 = attrs.item(0);
		var item1 = attrs.item(1);
		var item2 = attrs.item(2);
		should(item0).not.be.null;
		should(item1).not.be.null;
		should(item2).not.be.null;
		should(item0.nodeName).eql("attr1");
		should(item0.value).eql("value1");
		should(item1.nodeName).eql("test:attr2");
		should(item1.value).eql("value2");
		should(item2.nodeName).eql("attr3");
		should(item2.value).eql("hello world");
		should(attrs.item(3)).be.null;
		// getNamedItem
		var attr1 = attrs.getNamedItem("attr1");
		should(attr1).not.be.null;
		should(attr1.value).eql("value1");
		should(attrs.getNamedItem("idontexist")).eql(null);
		// getNamedItemNS
		var attr2 = attrs.getNamedItemNS("http://www.test.com/namespace", "attr2");
		should(attr2).not.be.null;
		should(attr2.value).eql("value2");
		should(attrs.getNamedItemNS(null, "fakeattr")).eql(null);
		var attr3 = attrs.getNamedItem("attr3");
		should(attr3).not.be.null;
		should(attr3.value).eql("hello world");
		var newAttr = xml.createAttribute("newAttr");
		newAttr.value = "newValue";
		// setNamedItem
		// Initial set, return value is null
		should(attrs.setNamedItem(newAttr)).eql(null);
		should(test.getAttribute("newAttr")).eql("newValue");
		var otherDocAttr = otherDoc.createAttribute("otherAttr");
		otherDocAttr.value = "otherValue";
		// Adding an attr from another doc throws an exception
		should(function() {
			attrs.setNamedItem(otherDocAttr);
		}).throw();
		// Reusing an existing attr node throws an exception
		should(function() {
			attrs.setNamedItem(child.getNamedItemNS("http://www.test.com/namespace", "name"));
		}).throw();
		var newAttr2 = xml.createAttribute("newAttr");
		newAttr2.value = "value2";
		// Setting an attr with an existing, should return the original
		should(attrs.setNamedItem(newAttr2)).eql(newAttr);
		should(test.getAttribute("newAttr")).eql("value2");
		var newAttr3 = attrs.getNamedItem("newAttr");
		should(newAttr3).eql(newAttr2);
		should(newAttr3.value).eql(newAttr2.value);
		// removeNamedItem
		var removedAttr;
		should(function() {
			removedAttr = attrs.removeNamedItem("newAttr");
		}).not.throw();
		should(removedAttr).eql(newAttr3);
		// Removing an attr that doesn't exist throws an exception
		should(function() {
			attrs.removeNamedItem("idontexist");
		}).throw();
		// setNamedItemNS
		newAttr = xml.createAttributeNS("http://www.test.com/namespace", "newAttr2");
		newAttr.value = "newValue2";
		should(attrs.setNamedItemNS(newAttr)).eql(null);
		// Adding an attr from another doc throws an exception
		should(function() {
			attrs.setNamedItemNS(otherDocAttr);
		}).throw();
		// Reusing an existing attr node throws an exception
		should(function() {
			attrs.setNamedItemNS(child.getNamedItemNS("http://www.test.com/namespace", "name"));
		}).throw();
		newAttr2 = attrs.getNamedItemNS("http://www.test.com/namespace", "newAttr2");
		should(newAttr2).eql(newAttr);
		should(newAttr2.value).eql(newAttr.value);
		// Setting an attr with an existing, should return the original
		newAttr3 = xml.createAttributeNS("http://www.test.com/namespace", "newAttr2");
		newAttr3.value = "value3";
		should(attrs.setNamedItemNS(newAttr3)).eql(newAttr2);
		should(test.getAttributeNS("http://www.test.com/namespace", "newAttr2")).eql("value3");
		// removeNamedItemNS
		should(function() {
			removedAttr = attrs.removeNamedItemNS("http://www.test.com/namespace", "newAttr2");
		}).not.throw();
		should(removedAttr).eql(newAttr3);
		// Removing an attr that doesn't exist throws an exception
		should(function() {
			attrs.removeNamedItemNS("http://www.test.com/namespace", "fakeattr");
		}).throw();
		// Ensure structure after modifications
		should(attrs.item(0)).eql(attr1);
		should(attrs.item(1)).eql(attr2);
		should(attrs.item(2)).eql(attr3);
		attrs = child.attributes;
		var name = attrs.getNamedItemNS("http://www.test.com/namespace", "name");
		should(name).not.be.null;
		should(name.nodeName).eql("test:name");
		should(name.value).eql("value");
*/		finish();
	});

	it("apiXmlDOMImplementation", function(finish) {
		var baseDoc = Ti.XML.parseString("<a/>");
		should(baseDoc).not.be.null;
/*		var impl = null;
		should(function() {
			impl = baseDoc.implementation;
		}).not.throw();
		should(impl).not.be.null;
		// createDocument
		should(impl.createDocument).be.a.Function;
		var testDoc = null;
		// Basic: no namespace, no doctype
		should(function() {
			testDoc = impl.createDocument(null, "the_root", null);
		}).not.throw();
		should(testDoc).not.be.null;
		should(testDoc.documentElement).not.be.null;
		should(testDoc.documentElement.namespaceURI).be.null;
		should(testDoc.documentElement.nodeName).eql("the_root");
		should(testDoc.documentElement.localName).eql("the_root");
		should(testDoc.doctype).be.null;
		// Create a doctype (which is useless in dom level 2)
		should(impl.createDocumentType).be.a.Function;
		var doctype = null;
		should(function() {
			doctype = impl.createDocumentType("qname", "pid", "sid");
		}).not.throw();
		// Document with doctype
		testDoc = null;
		should(function() {
			testDoc = impl.createDocument(null, "the_root", doctype);
		}).not.throw();
		should(testDoc).not.be.null;
		should(testDoc.documentElement).not.be.null;
		should(testDoc.documentElement.namespaceURI).be.null;
		should(testDoc.documentElement.nodeName).eql("the_root");
		should(testDoc.documentElement.localName).eql("the_root");
		should(testDoc.doctype).not.be.null;
		should(testDoc.doctype).eql(doctype);
		// Document with namespace but no doctype
		testDoc = null;
		should(function() {
			testDoc = impl.createDocument("http://test", "test:the_root", null);
		}).not.throw();
		should(testDoc).not.be.null;
		should(testDoc.documentElement).not.be.null;
		should(testDoc.documentElement.namespaceURI).not.be.null;
		should(testDoc.documentElement.namespaceURI).eql("http://test");
		should(testDoc.documentElement.nodeName).eql("test:the_root");
		should(testDoc.documentElement.localName).eql("the_root");
		should(testDoc.doctype).be.null;
		// Document with both namespace and doctype
		should(function() {
			doctype = impl.createDocumentType("qname", "pid", "sid");
		}).not.throw();
		testDoc = null;
		should(function() {
			testDoc = impl.createDocument("http://test", "test:the_root", doctype);
		}).not.throw();
		should(testDoc).not.be.null;
		should(testDoc.documentElement).not.be.null;
		should(testDoc.documentElement.namespaceURI).not.be.null;
		should(testDoc.documentElement.namespaceURI).eql("http://test");
		should(testDoc.documentElement.nodeName).eql("test:the_root");
		should(testDoc.documentElement.localName).eql("the_root");
		should(testDoc.doctype).not.be.null;
		should(testDoc.doctype).eql(doctype);
		// hasFeature
		should(impl.hasFeature).be.a.Function;
		var testResult;
		should(function() {
			testResult = impl.hasFeature("Core", "2.0");
		}).not.throw();
		should(testResult).be.Boolean;
		should(testResult).be.true;
		should(function() {
			testResult = impl.hasFeature("Fred", "Flinstone");
		}).not.throw();
		should(testResult).be.Boolean;
		should(testResult).be.false;
*/		finish();
	});

	it("xmlElement", function(finish) {
		var xml = Ti.XML.parseString(testSource["element.xml"]);
		var xml2 = Ti.XML.parseString(testSource["with_ns.xml"]);
/*		// Test element.getElementsByTagName
		var elements = xml.getElementsByTagName("dessert");
		should(elements).not.be.null;
		should(elements.length).eql(3);
		should(elements).be.an.Object;
		should(elements.item(0).tagName).eql("dessert");
		// Test element.getAttribute
		var attribute = elements.item(0).getAttribute("category");
		should(attribute).eql("icecream");
		var attributeFail = elements.item(0).getAttribute("categories");
		should(attributeFail).eql("");
		// Test element.getAttributeNode
		var attributeNode = elements.item(1).getAttributeNode("category");
		//Fails on iOS TIMOB-4867
		should(attributeNode).not.be.null;
		should(attributeNode.name).eql("category");
		should(attributeNode.value).eql("pie");
		var attributeNodeFail = elements.item(1).getAttributeNode("categories");
		should(attributeNodeFail).be.null;
		// Test element.hasAttribute
		var attributeTrue = null;
		var attributeFalse = null;
		should(function() {
			attributeTrue = elements.item(2).hasAttribute("category");
		}).not.throw();
		//Fails on iOS TIMOB-5024
		should(function() {
			attributeFalse = elements.item(2).hasAttribute("food");
		}).not.throw();
		should(attributeTrue).be.true;
		should(attributeFalse).be.false;
		// Test element.removeAttribute
		elements.item(0).removeAttribute("category");
		//Fails on iOS TIMOB-4868
		attribute = elements.item(0).getAttribute("category");
		should(attribute).eql("");
		// Test element.removeAttributeNode
		var dessertNode = elements.item(1).getAttributeNode("category");
		var errorNode = elements.item(1).getAttributeNode("error");
		should(errorNode).be.null;
		var attributeNodeRemove = elements.item(1).removeAttributeNode(dessertNode);
		should(attributeNodeRemove.name).eql("category");
		should(function() {
			elements.item(1).removeAttributeNode(errorNode);
		}).throw();
		// Test element.setAttribute
		elements = xml.getElementsByTagName("title");
		elements.item(0).setAttribute("rating", "taste yummy");
		should(elements.item(0).childNodes.item(0).nodeValue).eql("Banana Split");
		should(elements.item(0).getAttribute("rating")).eql("taste yummy");
		elements.item(0).setAttribute("rating", "cookie");
		should(elements.item(0).getAttribute("rating")).eql("cookie");
		should(function() {
			elements.item(0).setAttribute("?", "*");
		}).throw();
		// Test element.setAttributeNode
		elements = xml.getElementsByTagName("title");
		//Fails on iOS TIMOB-5027
		var newAttributeNode = xml.createAttribute("rating");
		newAttributeNode.value = "taste good";
		var newAttr = elements.item(1).setAttributeNode(newAttributeNode);
		should(newAttr).be.null;
		should(elements.item(1).childNodes.item(0).nodeValue).eql("Banana Cream Pie");
		should(elements.item(1).getAttribute("rating")).eql("taste good");
		var existAttributeNode = xml.createAttribute("rating");
		existAttributeNode.value = "tasty";
		var existAttr = elements.item(1).setAttributeNode(existAttributeNode);
		should(elements.item(1).getAttribute("rating")).eql("tasty");
		should(existAttr.value).eql("taste good");
		should(newAttributeNode).eql(existAttr);
		should(function() {
			elements.item(1).setAttributeNode(newAttributeNode);
		}).not.throw();
		should(function() {
			elements.item(2).setAttributeNode(newAttributeNode);
		}).throw();
		var newAttributeWrong = xml2.createAttribute("testing");
		newAttributeWrong.value = "exception";
		should(function() {
			elements.item(1).setAttributeNode(newAttributeWrong);
		}).throw();
*/		finish();
	});

	it("xmlElementNS", function(finish) {
		var xml = Ti.XML.parseString(testSource["elementNS.xml"]);
		var xml2 = Ti.XML.parseString(testSource["with_ns.xml"]);
		var namespace1 = "http://candystore.com";
		var namespace2 = "http://toystore.com";
/*		// Test element.getElementsByTagNameNS
		var elementsNS = xml.getElementsByTagNameNS(namespace1, "ingredient");
		var elementsNS2 = xml.getElementsByTagNameNS(namespace2, "material");
		should(elementsNS).not.be.null;
		should(elementsNS).be.an.Object;
		should(elementsNS.length).eql(3);
		should(elementsNS.item(0).tagName).eql("candy:ingredient");
		should(elementsNS2).not.be.null;
		should(elementsNS2).be.an.Object;
		should(elementsNS2.length).eql(3);
		should(elementsNS2.item(0).tagName).eql("toy:material");
		// Test element.getAttributeNS
		var attributeNS = elementsNS.item(0).getAttributeNS(namespace1, "amount");
		should(attributeNS).eql("one cup");
		var attributeFailNS = elementsNS.item(0).getAttributeNS(namespace1, "amounts");
		should(attributeFailNS).eql("");
		// Test element.getAttributeNodeNS
		var attributeNodeNS = elementsNS.item(1).getAttributeNodeNS(namespace1, "amount");
		should(attributeNodeNS.nodeName).eql("candy:amount");
		should(attributeNodeNS.nodeValue).eql("two cup");
		var attributeNodeFailNS = elementsNS.item(1).getAttributeNodeNS(namespace1, "amounts");
		should(attributeNodeFailNS).be.null;
		// Test element.hasAttributeNS
		var attributeNSTrue = null;
		var attributeNSFalse = null;
		should(function() {
			attributeNSTrue = elementsNS.item(2).hasAttributeNS(namespace1, "amount");
		}).not.throw();
		should(function() {
			attributeNSFalse = elementsNS.item(2).hasAttributeNS(namespace1, "food");
		}).not.throw();
		should(attributeNSTrue).be.true;
		should(attributeNSFalse).be.false;
		// Test element.removeAttributeNS
		elementsNS2.item(0).removeAttributeNS(namespace2, "content");
		attributeNS = elementsNS2.item(0).getAttributeNS(namespace2, "content");
		should(attributeNS).eql("");
		// Test element.setAttributeNS
		elementsNS2.item(1).setAttributeNS(namespace2, "toy:color", "white");
		should(elementsNS2.item(1).childNodes.item(0).nodeValue).eql("polyester");
		should(elementsNS2.item(1).getAttributeNS(namespace2, "color")).eql("white");
		elementsNS2.item(1).setAttributeNS(namespace2, "toy:color", "black");
		should(elementsNS2.item(1).getAttributeNS(namespace2, "color")).eql("black");
		should(function() {
			elementsNS2.item(1).setAttributeNS(namespace2, "?", "*");
		}).throw();
		should(function() {
			elementsNS2.item(1).setAttributeNS(namespace2, "malform:name:test", "test");
		}).throw();
		should(function() {
			elementsNS2.item(1).setAttributeNS(namespace3, "name:test", "namespace failure");
		}).throw();
		// Test element.setAttributeNodeNS
		var newAttributeNodeNS = xml.createAttributeNS(namespace2, "toy:color");
		newAttributeNodeNS.nodeValue = "blue";
		var newAttrNS = elementsNS2.item(2).setAttributeNodeNS(newAttributeNodeNS);
		should(newAttrNS).be.null;
		should(elementsNS2.item(2).childNodes.item(0).nodeValue).eql("buttons");
		should(elementsNS2.item(2).getAttributeNS(namespace2, "color")).eql("blue");
		var existAttributeNodeNS = xml.createAttributeNS(namespace2, "toy:color");
		existAttributeNodeNS.nodeValue = "pink";
		var existAttrNS = elementsNS2.item(2).setAttributeNodeNS(existAttributeNodeNS);
		should(elementsNS2.item(2).getAttributeNS(namespace2, "color")).eql("pink");
		should(existAttrNS.value).eql("blue");
		should(newAttributeNodeNS).eql(existAttrNS);
		should(function() {
			elementsNS.item(1).setAttributeNode(newAttributeNodeNS);
		}).not.throw();
		should(function() {
			elementsNS.item(2).setAttributeNode(newAttributeNodeNS);
		}).throw();
		var newAttributeNSWrong = xml2.createAttributeNS(namespace2, "toy:color");
		newAttributeNSWrong.value = "exception";
		should(function() {
			elementsNS2.item(1).setAttributeNode(newAttributeNSWrong);
		}).throw();
*/		finish();
	});
});