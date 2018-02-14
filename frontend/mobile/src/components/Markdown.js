import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import MarkdownRenderer from 'react-native-markdown-renderer';
import markdownRules from '../utils/Markdown';

@observer
class Markdown extends Component {
    render() {
        const { children } = this.props;

        return (
            <View style={{ flex: 1, padding: 10 }}>
                <MarkdownRenderer rules={markdownRules}>
                    {children instanceof Array ? children.join('') : children}
                </MarkdownRenderer>
            </View>
        );
    }
}

export default Markdown;
