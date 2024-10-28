import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../context/Auth";
import { useState } from "react";
import { patchAdminServerRequest} from "../../apis";
import { StyleSheet } from "react-native";
import { AdminServerListItem } from "../../types/interface";

type RootStackParamList = {
    ServerManaging: { server: AdminServerListItem };
};

type ServerManagingRouteProp = RouteProp<RootStackParamList, 'ServerManaging'>;

const ServerManaging: React.FC = () => {
    /// 네비게이션 등록
    const navigation = useNavigation();

    /// 루트
    const route = useRoute<ServerManagingRouteProp>();

    /// params
    const { server } = route.params;

    /// AccessToken 접근
    const { getAccessToken } = useAuth();

    const [editableFields, setEditableFields] = useState({
        name: { value: server.name, isEditing: false },
        billingAmount: { value: server.billingAmount, isEditing: false },
        requestDetails: { value: server.requestDetails, isEditing: false },
        modeCount: { value: server.modeCount.toString(), isEditing: false },
        status: { value: server.status, isEditing: false },
        serverAddress: { value: server.serverAddress, isEditing: false },
    });

    const [hasChanges, setHasChanges] = useState(false);

    const toggleEdit = (field: keyof typeof editableFields) => {
        setEditableFields(prev => ({
            ...prev,
            [field]: { ...prev[field], isEditing: !prev[field].isEditing }
        }));
        setHasChanges(true);
    };

    const handleChange = (field: keyof typeof editableFields, value: string) => {
        setEditableFields(prev => ({
            ...prev,
            [field]: { ...prev[field], value }
        }));
        setHasChanges(true);
    };

    const renderEditableField = (label: string, field: keyof typeof editableFields) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            {editableFields[field].isEditing ? (
                <TextInput
                    style={styles.input}
                    value={editableFields[field].value}
                    onChangeText={(value) => handleChange(field, value)}
                />
            ) : (
                <Text style={styles.value}>{editableFields[field].value}</Text>
            )}
            <TouchableOpacity onPress={() => toggleEdit(field)}>
                <Icon name={editableFields[field].isEditing ? "check" : "edit"} size={24} color="#6200ea" />
            </TouchableOpacity>
        </View>
    );

    const handleSave = async () => {
        try {
            const accessToken = await getAccessToken();
            if (!accessToken) {
                Alert.alert('Error', 'Authentication failed');
                return;
            }

            const updatedData = {
                name: editableFields.name.value,
                billingAmount: editableFields.billingAmount.value,
                requestDetails: editableFields.requestDetails.value,
                modeCount: parseInt(editableFields.modeCount.value),
                status: editableFields.status.value,
                serverAddress: editableFields.serverAddress.value,
            };

            const response = await patchAdminServerRequest(server.id, updatedData, accessToken);
            if (response && response.code === 'SU') {
                Alert.alert('Success', 'Server information updated successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to update server information');
            }
        } catch (error) {
            console.error('Error updating server:', error);
            Alert.alert('Error', 'An error occurred while updating server information');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Server Details</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Basic Information</Text>
                        <Text style={styles.field}>ID: {server.id}</Text>
                        {renderEditableField('Name', 'name')}
                        <Text style={styles.field}>Content: {server.content}</Text>
                        <Text style={styles.field}>Location: {server.location}</Text>
                        <Text style={styles.field}>Performance: {server.performance}</Text>
                        <Text style={styles.field}>Disk: {server.disk ? 'Yes' : 'No'}</Text>
                        <Text style={styles.field}>Backup: {server.backup}</Text>
                        <Text style={styles.field}>Game Title: {server.gameTitle}</Text>
                        <Text style={styles.field}>User ID: {server.userId}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Editable Information</Text>
                        {renderEditableField('Billing Amount', 'billingAmount')}
                        {renderEditableField('Request Details', 'requestDetails')}
                        {renderEditableField('Mode Count', 'modeCount')}
                        {renderEditableField('Status', 'status')}
                        {renderEditableField('Server Address', 'serverAddress')}
                    </View>

                    {hasChanges && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSave}>
                                <Text style={styles.buttonText}>Save Changes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#6200ea',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    field: {
        fontSize: 16,
        marginBottom: 5,
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    value: {
        fontSize: 16,
        flex: 2,
    },
    input: {
        fontSize: 16,
        flex: 2,
        borderWidth: 1,
        borderColor: '#6200ea',
        borderRadius: 5,
        padding: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#6200ea',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default ServerManaging;
