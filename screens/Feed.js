import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import PostCard from "./PostCard";

import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";
import firebase from "firebase";

import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

let Posts = require("./temp_posts.json");

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      Posts: []
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchPosts();
    this.fetchUser();
  }

  fetchPosts = () => {
    firebase
      .database()
      .ref("/posts/")
      .on(
        "value",
        snapshot => {
          let Posts = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              stories.push({
                key: key,
                value: snapshot.val()[key]
              });
            });
          }
          this.setState({ Posts: Posts });
          this.props.setUpdateToFalse();
        },
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }
      );
  };

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };

  renderItem = ({ item: story }) => {
    return <PostCard post={post} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }
              >
                Spectagram
              </Text>
            </View>
          </View>
          {!this.state.Posts[0] ? (
            <View style={styles.noPosts}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.noPostsTextLight
                    : styles.PostsText
                }
              >
                No Posts Available
              </Text>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.posts}
                renderItem={this.renderItem}
              />
            </View>
          )}
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
  },
  cardContainer: {
    flex: 0.85
  },
  noPosts: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  noPostsTextLight: {
    fontSize: RFValue(40),
  },
  noPostsText: {
    color: "white",
    fontSize: RFValue(40),
  }
});
