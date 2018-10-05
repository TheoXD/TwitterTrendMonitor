import React, { Component } from 'react';
import { View, StyleSheet, Animated, Image, Easing, Text } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';

import { withTheme } from 'react-native-paper';
import Hashtag from './hashtag';
import Picture from './picture';

import { Tweet } from './tweet_provider';

class TweetView extends Component {
    constructor(props) {
        super(props);

        this.data = props.data;
    
        this.theta = new Animated.Value(0);

        this.style = StyleSheet.create({
            tweet: {
              flexDirection: 'row',
              margin: 4,
            },
            tweet_texts: {
              margin: 4,
            },
            tweet_user: {
              fontSize: 28
            },
            attachments: {
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
            },
            text: {
            },
            avatar: {
              width: 64,
              height: 64,
              margin: 6,
              marginTop: 0,
              borderRadius: 64,
              borderWidth:1,
              borderColor:'rgba(80,100,120,1)',
            },
            tags: {
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap'
            },
            card: {
              backgroundColor: props.theme.colors.primary,
              margin: 2,
              marginLeft: 120,
              marginRight: 120,
              elevation: 10,
              width: '100%',
              overflow: 'hidden',
              transform: [
                { perspective: 850 },
                {
                  rotateX: this.theta.interpolate({
                    inputRange: [0, 180],
                    outputRange: ['0deg', '180deg']
                  })
                }
              ]

            }
          })

        this.id = this.props.id;
        this.hashtags = this.props.data.hashtags


        this.state = {
          timestamp_ms : this.props.data.timestamp_ms,
          name : this.props.data.name,
          screen_name : this.props.data.screen_name,
          text : this.props.text,
          hashtags : this.hashtags,
          images : this.props.data.images,
        };
    }

    show() {
        this.theta.setValue(90);
        Animated.timing(this.theta, {
          toValue: 0,
          duration: 200,
          easing: Easing.in
        }).start();
    }

    componentDidMount () {
      this.show();
    }

    render() {
      return (
        <Tweet.Consumer>
        {tweet_provider =>
        <Card style={this.style.card}>
        <Card.Content>
          <View style={this.style.tweet}>
            <Image style={this.style.avatar} source={{uri: this.data.profile_image_url }}></Image>
            <View style={this.style.tweet_texts}>
            <Title style={this.style.tweet_user}>Tweet {this.data.name} ({this.data.screen_name})</Title>
            <Text style={this.style.text} numberOfLines={1}>{this.data.text}</Text>
            </View>
          </View>
        </Card.Content>
        
        <View style={this.style.attachments}>
          {
                    this.data.images.map((image, i) => {
                        return <Picture key={i} url={image.media_url} tweet_provider={tweet_provider} tweet={this}></Picture>
                    }).reverse()
          }
        </View>

        <Card.Actions>
        <View style={this.style.tags}>
        {
                    this.state.hashtags.map((hashtag, i) => {
                        return <Hashtag key={i} text={hashtag.text}></Hashtag>
                    }).reverse()
        }
        </View>
        </Card.Actions>
      </Card>
      }
       </Tweet.Consumer>
      );
    }
}

export default withTheme(TweetView);
  