import { IEditorObjectData, SerializableObject } from "./interfaces/interface";


export class EditorObjectData implements IEditorObjectData {
    data: Record<string, SerializableObject> = {};

    setKey(key: string, value: SerializableObject) {
        this.data[key] = value;
    }

    clearData() {
        this.setData({})
    }

    setData(data: Record<string, SerializableObject>) {
        this.data = data;
    }

    getKey<T extends SerializableObject>(key: string, defaultValue?: T): T | undefined {
        return this.data[key] as T ?? defaultValue;
    }

}