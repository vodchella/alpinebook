import React from 'react';
import { Platform, View, Text } from 'react-native';
import markdown from '../styles/Markdown';
import PlatformEnum from '../enums/PlatformEnum';

function hasParents(parents, type) {
    return parents.findIndex(el => el.type === type) > -1;  
}

const markdownRules = {
    list_item: (node, children, parent, styles) => {
        if (hasParents(parent, 'bullet_list')) {
            return (
                <View key={node.key} style={styles.listUnorderedItem}>
                    <Text
                        style={markdown.listUnorderedItemIcon}
                    >
                        {Platform.select({
                            [PlatformEnum.ANDROID]: '\u2023',
                            [PlatformEnum.IOS]: '\u00B7'
                        })}
                    </Text>
                    <View style={[styles.listItem]}>{children}</View>
                </View>
            );
        }

        if (hasParents(parent, 'ordered_list')) {
            return (
                <View key={node.key} style={styles.listOrderedItem}>
                    <Text style={markdown.listOrderedItemIcon}>{node.index + 1}.</Text>
                    <View style={[styles.listItem]}>{children}</View>
                </View>
            );
        }

        return (
            <View key={node.key} style={[styles.listItem]}>
                {children}
            </View>
        );
    }
};

export default markdownRules;
