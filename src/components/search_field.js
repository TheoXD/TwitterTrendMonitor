import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';

import { Searchbar, withTheme, Appbar } from 'react-native-paper';

import { Tweet } from './tweet_provider';


class SearchField extends Component {
    constructor(props) {
        super(props);

        this.tweet_provider = props.tweet_provider;

        this.styles = StyleSheet.create({
            search_wrapper: {
                flexDirection: 'row'
            },
            search: {
                minWidth: '30%',
                maxWidth: 400,
                elevation: 1
            }
          })
    }

    onSearchPressed() {
        console.info("onSearchPressed");
        this.tweet_provider.state.singleton.doChangeFilter();
    }

    render() {
      return (
        <Tweet.Consumer>
        {tweet_provider => 
            <View style={this.styles.search_wrapper}>
            <Searchbar
                style={this.styles.search}
                placeholder={tweet_provider.state.filter}
                onChangeText={query => { 
                    tweet_provider.state.singleton.onFilterChanged(query);
                }}
                value={tweet_provider.state.filter}
            />
            <Appbar.Action icon="search" onPress={this.onSearchPressed.bind(this)} />
            </View>
        }
        </Tweet.Consumer>
      );
    }
}

export default withTheme(SearchField);
  