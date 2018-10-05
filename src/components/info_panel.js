import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { withTheme, Text, Button, Card, Switch } from 'react-native-paper';

import { HelperText, TextInput, Paragraph} from 'react-native-paper';

import { Tweet } from './tweet_provider';

import LoginForm from './login_form';

import Hashtag from './hashtag';


class InfoPanel extends withTheme(React.Component) {
    constructor(args) {
      super(args);
  
      this.styles = StyleSheet.create({
        info_panel: {
          backgroundColor: 'rgba(200, 230, 255, 1)',
          flex: 1,
          margin:12,
          borderRadius: 6,
          elevation: 10
        },
        info_wrapper: {
            margin:20,
        },
        input: {
            backgroundColor : "#FFFFFF"
        },
        text: {
            fontSize: 24,
            color: '#4D5D6D'
        },
        tags_wrapper: {
            margin:20,
            flexDirection: 'column',
        },
        tags: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap'
        }
      });

      this.state = {
          hashtag_min_count : 1,
          detect_faces : false,
          facepp_key : "",
          facepp_secret : ""
      }
  
    }

    onDisconnect(_tweet_provider) {
        _tweet_provider.state.singleton.DisconnectFromTweetProvider();
    }

    /*
    setTweetProviderUrl(_tweet_provider) {
        _tweet_provider.state.singleton.ConnectToTweetProvider(this.onConnected.bind(this));
    }
    */

    render() {
      return(
        <Card style={this.styles.info_panel}>
        <Tweet.Consumer>
        {tweet_provider =>
            <React.Fragment>
                <Card.Content>
                <LoginForm></LoginForm>
                <View style={this.styles.info_wrapper}>
                <Text style={this.styles.text}>Status: {tweet_provider.state.socket ? "Connected" : "Offline"}</Text>
                <Button style={this.styles.connect_button} mode="contained" onPress={() => this.onDisconnect(tweet_provider)}>Disconnect</Button>
                </View>

                <View style={this.styles.info_wrapper}>
                <Text style={this.styles.text}>Running average: {parseFloat(3600000 / tweet_provider.state.running_avg).toFixed(2)} tweets / hour</Text>
                </View>

                <View style={this.styles.info_wrapper}>
                <Text style={this.styles.text}>Enable face recognition:</Text>
                <Switch
                    value={this.state.detect_faces}
                    onValueChange={() =>
                    { this.setState({ detect_faces: !this.state.detect_faces }); }
                    }/>
                </View>

                {
                    this.state.detect_faces ?
                    <View style={this.styles.info_wrapper}>
                        <View>
                        <TextInput
                        mode="flat"
                        style={this.styles.input}
                        label="Face++ API key:"
                        value={tweet_provider.state.facepp_key}
                        onChangeText={text => tweet_provider.state.singleton.setState({ facepp_key: text })}
                        />
                        <TextInput
                        mode="flat"
                        secureTextEntry={true}
                        style={this.styles.input}
                        label="Face++ API secret:"
                        value={tweet_provider.state.facepp_secret}
                        onChangeText={text => tweet_provider.state.singleton.setState({ facepp_secret: text })}
                        />
                        </View>
                    <Text style={this.styles.text}>Males per hour: {parseFloat(3600000 / tweet_provider.state.running_avg_males).toFixed(2)} males / hour</Text>
                    <Text style={this.styles.text}>Females per hour: {parseFloat(3600000 / tweet_provider.state.running_avg_females).toFixed(2)} females / hour</Text>
                </View>
                 : null
                }

                </Card.Content>
                {this.props.children}
                <Card.Actions style={this.styles.tags_wrapper}>
                <Text style={this.styles.text}>Popular tags:</Text>
                <View style={this.styles.tags}>
                {
                                    tweet_provider.state.hashtags.map((hashtag, i) => {
                                        if(tweet_provider.state.hashtag_count[hashtag] >= tweet_provider.state.hashtag_min_count) {
                                            return <Hashtag text={hashtag} count={tweet_provider.state.hashtag_count[hashtag]}></Hashtag>
                                        }
                                    })
                }
                </View>
                </Card.Actions>
            </React.Fragment>

        }
        </Tweet.Consumer>
        </Card>
        );
    }
  }

  export default withTheme(InfoPanel);