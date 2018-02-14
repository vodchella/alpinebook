import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView } from 'react-native';
import { Container } from 'native-base';
import Markdown from 'react-native-markdown-renderer';
import markdownRules from '../utils/Markdown';
import SimpleHeader from '../components/SimpleHeader';

const description = `## Амангельды
##### 1Б к.т. с Запада по кулуару

![](http://mountain.kz/images/739.jpg)

**Описание маршрута:**
Вершина Амангельды находится в северо-западном ответвлении Мало-Алматинского отрога.
От альплагеря Туюкcу двигаться до метеостанции Мынжилки. После пересечения плотины повернуть на восток по крутому склону морены подняться к бивуаку Альпинград. От основного бивуака на площадке Альпинграда идти к подножию большого кулуара с западной стороны вершины, лавируя между возвышающимися островками скал.
Маршрут подходит под основание скальной башни вершины. Отсюда, пересекая еще один узкий кулуар, подойти к стенке крутизной 55-60 градусов, длиной 25м, которая преодолевается в лоб (перила) или попеременная страховка в зависимости от подготовленности группы. Пройдя стенку повернуть налево и по скальному гребню выйти на вершину.
Спуск по пути подъёма. Восхождение от альплагеря Туюксу занимает около 7-8 часов.
Первое восхождение на вершину совершила группа альпинистов из Алма-Аты в 1939 году в количестве шести человек под руководством В. Зимина.

**Рекомендации:**
1. Количество участников не ограничено.
1. Исходный бивуак – Альпинград.
1. Выход с бивуака в 6 часов.
1. Снаряжение на группу 4 человека:
   * веревка основная 2х40 м

![](http://mountain.kz/images/740.jpg)

![](http://mountain.kz/images/741.jpg)`;

@observer
class RouteScreen extends Component {
    render() {
        const { navigation } = this.props;

        return (
            <Container>
                <SimpleHeader
                    navigation={navigation}
                    caption={'Маршрут'}
                />
                <ScrollView>
                    <View style={{ flex: 1, padding: 10 }}>
                        <Markdown rules={markdownRules}>{description}</Markdown>
                    </View>
                </ScrollView>
            </Container>
        );
    }
}

export default RouteScreen;
