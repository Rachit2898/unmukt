import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput,FlatList, Linking, Dimensions } from 'react-native'


// Empty component

export default function Empty() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 20, color: '#000000'}}>No Data Found</Text>
        </View>
    );
}