import React, { Component } from 'react';
import { StyleSheet, View, Animated, Easing} from 'react-native';

import { withTheme } from 'react-native-paper';

import { HelperText, TextInput, Paragraph, Button, Modal, Portal } from 'react-native-paper';

import { Tweet } from './tweet_provider';


class LoginForm extends React.Component {
    constructor(args) {
      super(args);
  
      this.styles = StyleSheet.create({
        input: {
            backgroundColor : "#FFFFFF"
        },
        modal: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        form: {
            margin: 12
        },
        provider: {
            backgroundColor: 'rgba(200, 230, 255, 0.45)',
            flex: 1,
            marginLeft: 'auto',
            marginRight: 'auto',
            margin: 20,
            borderRadius: 6,
            elevation: 10,
            minWidth: 512,
            maxHeight: 320,
        },
        connect_button: {
            backgroundColor: "#5DDD5D"
        }
      });

  
    }

    
    state = {
        is_connected: false,
        visible: false
      }

    whenConnected() {
        this.hideModal();
    }

    whenDisconnected() {
        this.showModal();
    }

    setTweetProviderUrl(_tweet_provider) {
        console.info("setTweetProviderUrl");
        var _is_connected = _tweet_provider.state.singleton.ConnectToTweetProvider(this.whenConnected.bind(this));
        
        this.setState({is_connected: _is_connected});
        this.setState({visible: !_is_connected});
        this.hideModal();
    }

    componentDidMount () {
        this.showModal();
    }

    showModal() {
        this.setState({ visible: true });
    }

    hideModal() {
        if(this.state.is_connected) {
            this.setState({ visible: false });
        }
    }
  
    render() {
      return(
        <Tweet.Consumer>
        {tweet_provider =>
            <React.Fragment>
                <Portal>
                <Modal visible={tweet_provider.state.socket == null} onDismiss={this.hideModal.bind(this)} style={this.styles.modal}>
      
                <View style={this.styles.provider}>
                    <View style={this.styles.form}>
                    <Paragraph>Tweet Provider Credentials</Paragraph>
                    <TextInput
                    mode="flat"
                    style={this.styles.input}
                    label="Tweet Provider URL"
                    value={tweet_provider.state.tweet_provider_url}
                    onChangeText={text => tweet_provider.state.singleton.setState({ tweet_provider_url: text })}
                    />
                    <HelperText
                    type="error"
                    visible={!tweet_provider.state.tweet_provider_url.includes('http')}
                    >
                    Invalid URL
                    </HelperText>

                    <TextInput
                    secureTextEntry={true}
                    mode="flat"
                    style={this.styles.input}
                    label="Password"
                    value={tweet_provider.state.tweet_provider_url_password}
                    onChangeText={text => tweet_provider.state.singleton.setState({ tweet_provider_url_password: text })}
                    />
                    <Button style={this.styles.connect_button} mode="contained" onPress={() => this.setTweetProviderUrl(tweet_provider)}>Connect</Button>
                    </View>
                </View>
                </Modal>
                </Portal>
            </React.Fragment>

        }
        </Tweet.Consumer>
        );
    }
  }

  export default withTheme(LoginForm);