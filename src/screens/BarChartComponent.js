import {BarChart, Grid, XAxis} from 'react-native-svg-charts';
import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';

const BarChartComponent = ({target, achieved}) => {
  const data = [
    {
      value: target,
      svg: {
        fill: 'green',
      },
      label: 'Target',
    },
    {
      value: achieved,
      svg: {
        fill: 'red',
      },
      label: 'Achieved',
    },
  ];

  const Labels = ({x, y, bandwidth, data}) =>
    data.map((value, index) => (
      <React.Fragment key={index}>
        <Text
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 10}
          fontSize={14}
          fontWeight="bold"
          fill="white"
          textAnchor="middle">
          {value.value}
        </Text>
        <Text
          x={x(index) + bandwidth / 2}
          y="190"
          fontSize={14}
          fill="black"
          textAnchor="middle">
          {value.label}
        </Text>
      </React.Fragment>
    ));

  return (
    <View style={{height: 300, padding: 20}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          alignContent: 'center',
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: 'black',
            width: '50%',
            textAlign: 'center',
          }}>
          {target}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: 'black',
            width: '50%',
            textAlign: 'center',
          }}>
          {achieved}
        </Text>
      </View>
      <BarChart
        style={{flex: 1}}
        data={data}
        gridMin={0}
        yAccessor={({item}) => item.value}
        svg={{fill: 'rgba(134, 65, 244, 0.8)'}}
        contentInset={{top: 20, bottom: 20}}>
        <Grid belowChart={true} />
        {/* <Labels /> */}
      </BarChart>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <Text
          style={{
            fontSize: 9,
            fontWeight: 'bold',
            color: 'black',
            width: '50%',
            textAlign: 'center',
          }}>
          Target
        </Text>
        <Text
          style={{
            fontSize: 9,
            fontWeight: 'bold',
            color: 'black',
            width: '60%',
            textAlign: 'center',
          }}>
          Achieved
        </Text>
      </View>
    </View>
  );
};

export default BarChartComponent;
