import React from 'react'

import { Text, Image, ImageBackground, View, StyleSheet, Animated, Easing} from 'react-native'
import packageJson from '../package.json'

import { DefaultTheme, IconButton, Provider as PaperProvider } from 'react-native-paper';
import { Appbar } from 'react-native-paper';


import TweetList from './components/tweet_list';
import SearchField from './components/search_field';

import InfoPanel from './components/info_panel';

import { Tweet, TweetProvider} from './components/tweet_provider';

const theme = {
  ...DefaultTheme,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgba(200, 230, 255, 1)',
    accent: '#1da1fa',
  }
};



class App extends React.Component {
  constructor () {
    super();

    this.state = {
      filter: 'JavaScript'
    }

    this.tweet_list_instance = null;
    this.search_field = null;

    this.opacity = new Animated.Value(0);

    this.styles = StyleSheet.create({
      provider: {
      },
      twitter_logo: {
        marginLeft: 12,
        height:64,
        width:64,
      },
      columns: {
        flexDirection: 'row',
        flex: 1
      },
      bg: {
        flex: 1,
        backgroundColor: '#48C3ED',
      },
      background: {
        flex: 1,
        width: null,
        height: null,
      },
      tweet_list: {
        flex: 1,
      },
      right_panel: {
        flex:1,
        width: '50%',
        maxHeight: 640
      },
      content: {
        flexDirection: 'row',
        flex: 1
      },
      app: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      header: {
        marginTop: 4,
        marginBottom: 4,
        elevation: 10
      },
      text: {
        fontSize: 20,
        margin: 4,
        color: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
      },
      image: {
        marginBottom: 50,
        width: 83,
        height: 97
      },
      button: {
        marginTop: 50,
        borderWidth: 2,
        borderColor: '#62DBFB',
        height: 50,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center'
      },
      buttonText: {
        color: '#62DBFB',
        fontSize: 20
      }
    })

    this.twitter_logo = require('../assets/images/twitter_logo.png')
    this.background_image = require('../assets/images/background.png');
  }

  show() {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 2500,
    }).start();
  }

  componentDidMount () {
    //TODO: wait for bg image being fully loaded
    this.show();
  }
 
  render () {
    return (
      <TweetProvider>
        <Tweet.Consumer>
        {tweet_provider => 
          <PaperProvider theme={theme} style={this.styles.provider}>
          <Appbar.Header style={this.styles.header}>
          <Image source={this.twitter_logo} style={this.styles.twitter_logo}></Image>
          
          <Appbar.Content
            title={packageJson.fullName}
            subtitle={packageJson.version}
          />
          <SearchField ref={(_ref) => this.search_field = _ref} tweet_provider={tweet_provider}></SearchField>
        </Appbar.Header>
        

        <View style={this.styles.bg}>
          <ImageBackground source={this.background_image} style={this.styles.background}>

          <View style={this.styles.content}>
            <TweetList ref={(_ref) => this.tweet_list_instance = _ref} style={this.styles.tweet_list} network={tweet_provider}></TweetList>
            <View style={this.styles.right_panel}>
              <InfoPanel>
              </InfoPanel>
            </View>
          </View>

          <Text style={this.styles.text}>{packageJson.fullName} v{packageJson.version}</Text>
          </ImageBackground>
        </View>
        
        </PaperProvider>
      }
      </Tweet.Consumer>
    </TweetProvider>
    );
  }
}

export default App
