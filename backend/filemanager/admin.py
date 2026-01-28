from django.contrib import admin
from .models import UploadedFile


@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('original_filename', 'file_type', 'file_size', 'uploaded_by', 'upload_date')
    list_filter = ('file_type', 'upload_date')
    search_fields = ('original_filename', 'uploaded_by', 'description')
    readonly_fields = ('upload_date', 'file_size')
    
    fieldsets = (
        ('File Information', {
            'fields': ('file', 'file_type', 'original_filename', 'file_size')
        }),
        ('Metadata', {
            'fields': ('uploaded_by', 'description', 'upload_date')
        }),
        ('Image Details', {
            'fields': ('image_width', 'image_height'),
            'classes': ('collapse',)
        }),
    )
