from rest_framework import serializers
from .models import UploadedFile


class UploadedFileSerializer(serializers.ModelSerializer):
    file_url = serializers.CharField(source='file_url', read_only=True)
    file_extension = serializers.CharField(source='get_file_extension', read_only=True)
    
    class Meta:
        model = UploadedFile
        fields = [
            'id',
            'file',
            'file_url',
            'file_type',
            'original_filename',
            'file_size',
            'file_extension',
            'uploaded_by',
            'upload_date',
            'description',
            'image_width',
            'image_height',
        ]
        read_only_fields = ['id', 'upload_date', 'file_size']
    
    def create(self, validated_data):
        # Get file size
        file_obj = self.context['request'].FILES.get('file')
        if file_obj:
            validated_data['file_size'] = file_obj.size
            validated_data['original_filename'] = file_obj.name
        
        return super().create(validated_data)
