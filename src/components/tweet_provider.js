import React, { Component } from "react";
import socketIOClient from "socket.io-client";

const Tweet = React.createContext('twitter');


class TweetData {
  constructor(args) {
      this.id = args.data.id;
      this.text = args.data.text;
      this.created_at = args.data.created_at;

      this.hashtags = args.data.entities.hashtags;
      this.name = args.data.user.name;
      this.screen_name = args.data.user.screen_name;

      this.images = [];

      if("media" in args.data.entities) {
          this.images = args.data.entities.media;
      }
      
      this.username = args.data.user.name;
      this.profile_image_url = args.data.user.profile_image_url;
      this.timestamp_ms = args.data.timestamp_ms;
      this.retweeted = args.data.retweeted;
  }
}

class TweetProvider extends React.Component {
    constructor(args) {
        super(args);
      
        this.state = { 
          singleton: this,
          hashtags: [],
          hashtag_count: {},
          filter: "Bowsette",
          tweet_array: [],
          tweet_provider_url: "http://www.myethersports.com:8081",
          tweet_provider_url_password: "1234567890",
          facepp_key : "",
          facepp_secret : "",
          socket: null,
          hashtag_min_count : 1,
          start_time: 0,
          n_of_tweets: 0,
          running_avg: 0,
          

          n_of_females: 0,
          running_avg_females: 0,
          n_of_males: 0,
          running_avg_males: 0
        };
    }



    DisconnectFromTweetProvider() {
      this.state.socket.close();
      this.setState({socket: null});
      return true;
    }

    ConnectToTweetProvider(_callback) {
      this.setState({ start_time: Date.now(), n_of_tweets : 0, running_avg : 0 }); //reset
      this.setState({  n_of_females : 0, running_avg_females : 0 }); //reset
      this.setState({  n_of_males : 0, running_avg_males : 0 }); //reset

      if(this.state.socket != null) return false; //Already has socket

      this.state.socket = socketIOClient(this.state.tweet_provider_url)

      this.state.socket.on('connect', () => {
        console.log("Socket Connected");
        _callback.call();

        this.state.socket.on("tweets", data => {
            console.info(data);

            var hashtags = data.entities.hashtags;

            hashtags.map((hashtag, i) => {
              if(this.state.hashtags.indexOf(hashtag.text) === -1) {
                var text = hashtag.text;

                this.setState(prevState => ({
                  hashtags: [...prevState.hashtags, text]
                }))
              }
              
              if(!this.state.hashtag_count[hashtag.text]) {
                var new_hashtag_count = {...this.state.hashtag_count};
                new_hashtag_count[hashtag.text] = 1;

                this.setState({
                  hashtag_count: new_hashtag_count
                })
                
              }

              if(!data.retweeted && hashtag.text != this.state.filter) {
                var new_hashtag_count = {...this.state.hashtag_count};
                new_hashtag_count[hashtag.text] += 1;

                this.setState({
                  hashtag_count: new_hashtag_count
                })
                
              }
            });

            //Calculate number of hashtags to display
            var avg_count = 0;
            this.state.hashtags.forEach((hashtag) => {
                avg_count += this.state.hashtag_count[hashtag];
            })

            
            var time_diff = parseInt(data.timestamp_ms) - this.state.start_time;

            this.setState({ 
              hashtag_min_count: parseInt(avg_count / this.state.hashtags.length) + 1,
              n_of_tweets: this.state.n_of_tweets+=1,
            })

            this.setState({ 
              running_avg: time_diff / this.state.n_of_tweets
            })

            this.addTweet(new TweetData({data:data}));
        });
      });
      
      this.state.socket.on('disconnect', () => {
        this.state.socket.off("tweets")
        this.state.socket.removeAllListeners("tweets");
        console.log("Socket Disconnected");
      });

      return true;
    }

    componentDidMount () {
      //this.ConnectToTweetProvider(this.state.tweet_provider_url);
    }

    addTweet(_tweet){
      this.state.tweet_array.push(_tweet)
      this.setState({
          tweet_array: this.state.tweet_array
      })
    }

    onFilterChanged(_query) {
      this.setState({
        filter: _query
      })
    }

    doChangeFilter() {
      console.info("sending new filter: " + this.state.filter);
      this.state.socket.emit("set_filter", this.state.filter);
    }

    render() {
      return (
        <Tweet.Provider value={{state: this.state}}>
          {this.props.children}
        </Tweet.Provider>
      )
    }

  }

  export { Tweet, TweetProvider };
