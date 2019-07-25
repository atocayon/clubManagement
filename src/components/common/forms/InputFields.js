import React, { Component } from "react";
import { View, Text } from "react-native";
import {Icon, Input, Item} from 'native-base';


export default class InputFields extends Component{

    constructor(props) {
        super(props);

    }


    render(){
        const {field,form}= this.props;

        let itemProps = {
            error: false
        };

        if (form.errors[field.name]) {
            itemProps.error = true;
        }

        return(
            <React.Fragment>
                <Item  {...itemProps} rounded style={{ margin: 5 }}>
                    <Input
                        onChangeText={(e) => {
                            form.setFieldValue(field.name, e)
                        }}
                        value={field.value}
                        {...this.props}
                        {...this.props}
                    />
                    {itemProps.error ? (<Icon name='close-circle' />) : null}

                </Item>
                {itemProps.error == true && (
                    <Text style={{ marginLeft: 20, color: "red" }}>
                        {form.errors[field.name]}
                    </Text>
                )}

            </React.Fragment>
        );
    }
}
