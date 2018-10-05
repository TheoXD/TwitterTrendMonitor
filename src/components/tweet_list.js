import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import TweetView from './tweet_view';

import { Button } from 'react-native-paper';
import { withTheme } from 'react-native-paper';

import { Tweet } from './tweet_provider';

const { width, height } = Dimensions.get("window");

class TweetList extends React.Component {
    constructor(args) {
        super(args);

        this.network = args.network;
        console.info(this.network);
        this.socket = this.network.state.socket;

        this.state = {
            tweet_array: [],
            head: 0,
            scrollEnabled: true
        }

        this.styles = StyleSheet.create({
            tweet_list: {
              flex: 1,
              margin:10,
              maxHeight: height - 64 - 64,
            },
            tweet: {
            }
          });
    }

    addTweet(_tweet){
        this.state.tweet_array.push(_tweet)
        this.setState({ 
            tweet_array: this.state.tweet_array,
            head: this.state.head+1
        })
    }

    render() {

        return (
            <Tweet.Consumer>
            {tweet_provider => 
                <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={this.state.scrollEnabled} style={this.styles.tweet_list}>
                    {
                        tweet_provider.state.tweet_array.map((tweet, i) => {
                            return <TweetView key={-i} id={this.state.head} data={tweet}>tweet</TweetView>
                        }).reverse()
                    }
                </ScrollView>
            }
            </Tweet.Consumer>
          );
    }
};

export default withTheme(TweetList);
  