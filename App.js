/*
 * Selaine Rodriguez - CS 47 Winter 2022
 * ---
 * This app will allow you to connect to the Spotify API and display your top songs or
 * top songs from a specific album. The album can be changed by changing information in
 * constants.js.
 */

import { StyleSheet, Text, SafeAreaView, Pressable, FlatList, Image, View} from "react-native";
import React, { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"
import Images from "./Themes/images"
import millisToMinutesAndSeconds from "./utils/millisToMinuteSeconds";

// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

export default function App() {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      // Select which option you want: Top Tracks or Album Tracks
      // Comment out the one you are not using
      //myTopTracks(setTracks, token);
      albumTracks(ALBUM_ID, setTracks, token);
    }
  }, [token]);

  // Display for the Spotify Authentication Screen
  const SpotifyAuthButton = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable
          style={styles.connectButton}
          onPress={promptAsync}
        >
          <Image style={styles.connectLogo} source={Images.spotify} />
          <Text style={styles.connectText}>CONNECT WITH SPOTIFY</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // For each song index, this will get the appropriate information and render the screen
  // The screen will display all of the songs in a form similar to Spotify itself
  const renderSong = ({ index }) => {
    let songInfo = tracks[index];
    let trackNumber = songInfo["track_number"];
    let songName = songInfo["name"];

    let artistInfo = songInfo["artists"];
    let artistName = artistInfo[0]["name"];

    let albumInfo = songInfo["album"];
    let albumName = albumInfo["name"];

    let songLength = millisToMinutesAndSeconds(songInfo["duration_ms"]);

    let albumImages = albumInfo["images"];
    let albumPicLink = albumImages[0]["url"];

    // Actual rendering for this component
    return (
      <View style={styles.songContainer}>
        <View style={styles.trackNumber}>
          <Text style={styles.grayText}>{trackNumber}</Text>
        </View>
        <View>
          <Image style={styles.albumPic} source={{ uri: albumPicLink, }} alt="Album Cover Picture"/>
        </View>
        <View style={styles.songArtist}>
          <Text style={styles.whiteText} numberOfLines={1}>{songName}</Text>
          <Text style={styles.grayText} numberOfLines={1}>{artistName}</Text>
        </View>
        <View style={styles.albumName}>
          <Text style={styles.whiteText} numberOfLines={1}>{albumName}</Text>
        </View>
        <View style={styles.albumLength}>
          <Text style={styles.whiteText}>{songLength}</Text>
        </View>
      </View>
    );
  }

  // Create flatlist that is made up of the different song components
  const SongsFlatList = () => {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>Current Album Tracks</Text>
        </View>
        <View>
          <FlatList
            data={tracks}
            renderItem={(item) => renderSong(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Decides which content to display appropriately
  let contentDisplayed = null;
  if (token) {
    contentDisplayed = <SongsFlatList />
  } else {
    contentDisplayed = <SpotifyAuthButton />
  }

  return (
    <SafeAreaView style={styles.container}>
      {contentDisplayed}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  connectButton: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: Colors.spotify,
    color: "white",
    borderRadius: 999999999999,
    width: "80%",
  },

  connectText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 18,
    margin: 10,
    marginLeft: 0,
  },

  connectLogo: {
    flex: 1,
    margin: 5,
    marginRight: 0,
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },

  title: {
    fontWeight: "bold",
    color: "white",
    fontSize: 18,
    margin: 10,
  },

  songContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    alignItems: "center",
  },

  trackNumber: {
    display: "flex",
    width: "8%",
    justifyContent: "center",
    alignItems: "center",
  },

  albumPic: {
    width: 50,
    height: 50,
    borderRadius: 3,
  },

  songArtist: {
    display: "flex",
    width: "40%",
    justifyContent: "center",
    padding: 10,
  },

  albumName: {
    display: "flex",
    width: "30%",
    justifyContent: "center",
    padding: 10,
  },

  albumLength: {
    justifyContent: "center",
  },

  whiteText: {
    color: "white",
  },

  grayText: {
    color: "lightgray",
  },
});