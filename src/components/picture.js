import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { withTheme, Text} from 'react-native-paper';


class Picture extends Component {
    constructor(props) {
      super(props);

      this.tweet_provider = props.tweet_provider;
      this.tweet = props.tweet;
  
      this.style = StyleSheet.create({
        image_container : {
          flex: 1,
          flexDirection: 'row'
        },
        image : {
          maxWidth: 320,
          height:100,
          margin: 10,
          borderRadius: 10,
          flex: 1
        },
        image_stats : {
          margin: 10
        }
      });
  
      this.state = {
        url : props.url,
        males: 0,
        females: 0,
        n_of_people: 0,
      };
    }

    componentDidMount () {
      this.DetectFaces(this.state.url, this.tweet_provider);
    }
  
    DetectFaces(_image_url, _tweet_provider) {
      console.info(_image_url);
      console.info(_tweet_provider);
      if(_tweet_provider.state.facepp_key == "" || _tweet_provider.state.facepp_secret == "") return;

      const file = "./bevor.jpg";
      const formData = new FormData();

      formData.append('api_key', _tweet_provider.state.facepp_key);
      formData.append('api_secret', _tweet_provider.state.facepp_secret);
      formData.append('return_attributes', "gender");
      formData.append('image_url', _image_url);

      if(!this.tweet.data.retweeted) {
        fetch(`https://api-us.faceplusplus.com/facepp/v3/detect`, {
            method: 'POST',
            body: formData
          }).then(res => {
            return res.json();
        }).then(parsed_data => {
            if(parsed_data.faces) {
              console.info("people found:");
              parsed_data.faces.forEach(face => {
                  this.setState({n_of_people: this.state.n_of_people+1});
                  console.info(face.attributes);

                  var time_diff = parseInt(this.tweet.data.timestamp_ms) - this.tweet_provider.start_time;

                  if(face.attributes.gender.value == "Male") {
                    this.setState({males: this.state.males+1});
                  }
                  if(face.attributes.gender.value == "Female") {
                    this.setState({females: this.state.females+1});
                  }
              });

              /*
              console.info("males:" + this.state.males);
              console.info("females:" + this.state.females);
              */

              var time_diff = parseInt(this.tweet.data.timestamp_ms) - this.tweet_provider.state.start_time;

              if(this.state.males > 0) {
                this.tweet_provider.state.singleton.setState({ n_of_males: this.tweet_provider.state.n_of_males+this.state.males });
                var _running_avg_males = time_diff / this.tweet_provider.state.n_of_males;
                _running_avg_males = isFinite(_running_avg_males) ? _running_avg_males : 0.0;

                this.tweet_provider.state.singleton.setState({ running_avg_males: _running_avg_males });
              }

              if(this.state.females > 0) {
                this.tweet_provider.state.singleton.setState({ n_of_females: this.tweet_provider.state.n_of_females+this.state.females });
                var _running_avg_females = time_diff / this.tweet_provider.state.n_of_females;
                _running_avg_females = isFinite(_running_avg_females) ? _running_avg_females : 0.0;

                this.tweet_provider.state.singleton.setState({ running_avg_females: _running_avg_females });
              }

              /*
              console.info("time_diff: " + time_diff);
              console.info("running_avg_females: " + this.tweet_provider.state.n_of_females);
              console.info("running_avg_males: " + this.tweet_provider.state.n_of_males);
              */
            }
          });
        }
    }


    render() {
      return(
        <View style={this.style.image_container}>
          <Image style={this.style.image} source={{ uri: this.state.url }}/>
          <View style={this.style.image_stats}>
            <Text>People found: { this.state.n_of_people } </Text>
            <Text>Males found: { this.state.males } </Text>
            <Text>Females found: { this.state.females } </Text>
          </View>
        </View>
        );
    }
  }


export default withTheme(Picture);