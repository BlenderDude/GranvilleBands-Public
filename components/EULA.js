import React, {Component} from 'react'
import {
    View,
    Modal,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native'

export default class EULA extends Component {
    render() {
        return (
            <Modal
                visible={this.props.visible}
                animationType="slide"
                onRequestClose={this.props.close}
            >
                <View
                    style={{
                        marginTop: 35,
                        borderBottomWidth: StyleSheet.hairlineWidth
                    }}
                >
                    <Text
                        style={{
                            marginLeft: 20,
                            fontSize: 18,
                            marginBottom: 5,
                            color: '#386aff'
                        }}
                        onPress={this.props.close}
                    >
                        Close
                    </Text>

                </View>

                <ScrollView>
                    <View
                        style={{marginHorizontal: 10,}}
                    >
                        <Text>
                            {eula}
                        </Text>
                    </View>
                </ScrollView>
            </Modal>
        )
    }
}
const eula = `
End-User License Agreement (EULA) of Granville Bands

This End-User License Agreement ("EULA") is a legal agreement between you and Daniel Abdelsamed

This EULA agreement governs your acquisition and use of our Granville Bands software ("Software") directly from Daniel Abdelsamed or indirectly through a Daniel Abdelsamed authorized reseller or distributor (a "Reseller").

Please read this EULA agreement carefully before completing the installation process and using the Granville Bands software. It provides a license to use the Granville Bands software and contains warranty information and liability disclaimers.

If you register for a free trial of the Granville Bands software, this EULA agreement will also govern that trial. By clicking "accept" or installing and/or using the Granville Bands software, you are confirming your acceptance of the Software and agreeing to become bound by the terms of this EULA agreement.

If you are entering into this EULA agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions. If you do not have such authority or if you do not agree with the terms and conditions of this EULA agreement, do not install or use the Software, and you must not accept this EULA agreement.

This EULA agreement shall apply only to the Software supplied by Daniel Abdelsamed herewith regardless of whether other software is referred to or described herein. The terms also apply to any Daniel Abdelsamed updates, supplements, Internet-based services, and support services for the Software, unless other terms accompany those items on delivery. If so, those terms apply.

License Grant

Daniel Abdelsamed hereby grants you a personal, non-transferable, non-exclusive licence to use the Granville Bands software on your devices in accordance with the terms of this EULA agreement.

You are permitted to load the Granville Bands software (for example a PC, laptop, mobile or tablet) under your control. You are responsible for ensuring your device meets the minimum requirements of the Granville Bands software.

You are not permitted to:

- Post any content that could be seen as objectionable in any way. Daniel Abdelsamed and anyone he permits has the authority to remove such content and delete your account without prior notice
- Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the Software nor permit the whole or any part of the Software to be combined with or become incorporated in any other software, nor decompile, disassemble or reverse engineer the Software or attempt to do any such things
- Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose
- Allow any third party to use the Software on behalf of or for the benefit of any third party
- Use the Software in any way which breaches any applicable local, national or international law
- use the Software for any purpose that Daniel Abdelsamed considers is a breach of this EULA agreement


Intellectual Property and Ownership

Daniel Abdelsamed shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of Daniel Abdelsamed.

Daniel Abdelsamed reserves the right to grant licences to use the Software to third parties.

Termination

This EULA agreement is effective from the date you first use the Software and shall continue until terminated. You may terminate it at any time upon written notice to Daniel Abdelsamed.

It will also terminate immediately if you fail to comply with any term of this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will immediately terminate and you agree to stop all access and use of the Software. The provisions that by their nature continue and survive will survive any termination of this EULA agreement.

Governing Law

This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of United States.

`