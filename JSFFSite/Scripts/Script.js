/*! Script.js 1.0.0.0
 * 
 */

"use strict";

require(['ss', 'd3', 'Facebook', 'jquery'], function(ss, d3, Facebook, $) {
  var $global = this;

  // JSFFScript.FFJS

  function FFJS() {
  }
  FFJS.buttonClicked = function(e) {
    var options = {};
    options.scope = 'email';
    FB.login(function(response) {
    }, options);
  };
  FFJS.graphFriendsTweek = function(e) {
    var charge = $('#charge').val();
    var distance = $('#distance').val();
    FFJS.graphFriends(null, (ss.emptyString(charge)) ? -120 : parseInt(charge), (ss.emptyString(distance)) ? 80 : parseInt(distance));
  };
  FFJS.graphFriends = function(e, charge, linkDistance) {
    var start = ss.now();
    $('#canvas').empty();
    var nodes = [];
    var links = [];
    var options = {};
    FB.api('/me/friends', function(apiResponse) {
      if (!!!apiResponse.error) {
        FFJS._queryFacebookForFreindsGraph(charge, linkDistance, start, nodes, links, apiResponse);
      }
      else {
        $('body').append('Error: ' + apiResponse.error.message);
      }
    });
  };
  FFJS._queryFacebookForFreindsGraph = function(charge, linkDistance, start, nodes, links, apiResponse) {
    for (var x = 0; x < (apiResponse.data).length; x++) {
      var friend = new Friend((apiResponse.data)[x], x);
      FFJS.friends[friend.id] = friend;
      var noeNode = {};
      noeNode.name = friend.name;
      noeNode.group = 1;
      noeNode.id = friend.id;
      nodes[nodes.length] = noeNode;
    }
    var q = {};
    q.friendsAll = 'SELECT uid1, uid2 from friend WHERE uid1 = me()';
    q.friendsoffriends = 'SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsAll) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2';
    var queryOptions = {};
    queryOptions.method = 'fql.multiquery';
    queryOptions.queries = q;
    FB.api(queryOptions, function(queryResponse) {
      FFJS._buildGraph(charge, linkDistance, start, nodes, links, queryResponse);
    });
  };
  FFJS._buildGraph = function(charge, linkDistance, start, nodes, links, queryResponse) {
    for (var i = 0; i < queryResponse[1].fql_result_set.length; i++) {
      var results = queryResponse[1].fql_result_set[i];
      var target = (FFJS.friends[results.uid1]);
      var origin = (FFJS.friends[results.uid2]);
      origin.links.push(target.id);
      target.links.push(origin.id);
      var newLink = {};
      newLink.source = origin.index;
      newLink.target = target.index;
      newLink.value = 1;
      links[links.length] = newLink;
    }
    var finish = ss.now();
    var milli = start.getMilliseconds() - finish.getMilliseconds();
    $('body').append('query took: ' + (milli / 1000));
    FFJS._createSVG(charge, linkDistance, nodes, links);
  };
  FFJS._createSVG = function(charge, linkDistance, nodes, links) {
    var width = 960;
    var height = 800;
    FFJS.zoom = d3.behavior.zoom().scaleExtent([ 0.4, 4 ]).on('zoom', FFJS._zoomed);
    var force = d3.layout.force().charge(charge).linkDistance(linkDistance).size([ width, height ]);
    FFJS.SVG = d3.select('#canvas').append('svg').attr('width', width).attr('height', height).call(FFJS.zoom).append('g');
    force.nodes(nodes).links(links).start();
    FFJS.links = FFJS.SVG.selectAll('.link').data(links).enter().append('line').attr('class', 'link').style('stroke-width', function(d) {
      return Math.sqrt(d['value']);
    });
    FFJS.nodes = FFJS.SVG.selectAll('.node').data(nodes).enter().append('circle').attr('class', 'node').attr('r', 7).call(force.drag).on('mousemove', FFJS.onMouseMove).on('mouseover', FFJS.onMouseOver).on('mouseout', FFJS.onMouseOut).on('click', FFJS._onNodeClick);
    FFJS.nodes.append('title').text(function(D) {
      return D['name'];
    });
    force.on('tick', FFJS.update);
  };
  FFJS._onNodeClick = function(arg) {
    FFJS.selectedID = (arg['id'] === FFJS.selectedID) ? null : arg['id'];
    FFJS.update();
  };
  FFJS._zoomed = function(arg) {
    FFJS.SVG.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
  };
  FFJS.update = function() {
    FFJS.links.attr('x1', function(D) {
      return (D['source'])['x'];
    }).attr('y1', function(D) {
      return (D['source'])['y'];
    }).attr('x2', function(D) {
      return (D['target'])['x'];
    }).attr('y2', function(D) {
      return (D['target'])['y'];
    }).style('stroke-width', function(D) {
      if (!!FFJS.selectedID && FFJS.matchesTargetOrSource(D, FFJS.selectedID)) {
        return 2;
      }
      else {
        return 1;
      }
    });
    FFJS.nodes.attr('cx', function(D) {
      return D['x'];
    }).attr('cy', function(D) {
      return D['y'];
    }).attr('fill', function(D) {
      if (!!!FFJS.selectedID) {
        return 'black';
      }
      if (((FFJS.friends[FFJS.selectedID]).links.indexOf(D['id']) >= 0)) {
        return 'red';
      }
      return (D['id'] === FFJS.selectedID) ? 'green' : 'black';
    });
  };
  FFJS.onMouseMove = function(d) {
    d3.event.stopPropagation();
    var callout = $('#callout');
  };
  FFJS.onMouseOver = function(d) {
    d3.event.stopPropagation();
    var callout = $('#callout');
    callout.show();
    var template = "<p><img src='http://graph.facebook.com/{0}/picture' alt='{1}' height='100' width='100'></p><p>{1}</p>";
    callout.html(ss.format(template, d['id'], d['name']));
  };
  FFJS.onMouseOut = function(d) {
    d3.event.stopPropagation();
    var callout = $('#callout');
    callout.hide();
  };
  FFJS.matchesTargetOrSource = function(d, id) {
    return (d['source'])['id'] === id || (d['target'])['id'] === id;
  };
  FFJS.logOut = function(e) {
    FB.logout(function(response) {
    });
  };
  FFJS.onload = function() {
    $('#login').click(FFJS.buttonClicked);
    $('#graph').click(FFJS.graphFriendsTweek);
    var options = {};
    options.appId = '459808530803920';
    options.channelUrl = 'http://jsff.asurewebsites.com/channel.aspx';
    options.status = true;
    options.cookie = true;
    options.xfbml = false;
    FB.init(options);
    FB.getLoginStatus(function(loginResponse) {
      if (loginResponse.status === 'connected') {
        FFJS.userID = loginResponse.authResponse.userID;
      }
    });
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      if (response.status === 'connected') {
        FFJS.userID = response.authResponse.userID;
      }
      else {
      }
    });
  };


  // JSFFScript.Friend

  function Friend(_response, _index) {
    this.index = 0;
    this.name = _response.name;
    this.id = _response.id;
    this.index = _index;
    this.links = [];
  }
  var Friend$ = {

  };


  var $exports = ss.module('Script',
    {
      FFJS: [ FFJS, null, null ]
    },
    {
      Friend: [ Friend, Friend$, null ]
    });

  FFJS.friends = {};
  FFJS.selectedID = null;
  FFJS.failCall = true;
  $(FFJS.onload);

});
