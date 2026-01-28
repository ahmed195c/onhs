from django.db import models
from django.core.validators import FileExtensionValidator
from django.utils.timezone import now

class UploadedFile(models.Model):
    """Model for storing uploaded PDF and image files"""
    
    FILE_TYPE_CHOICES = [
        ('image', 'Image'),
        ('pdf', 'PDF Document'),
    ]
    
    file = models.FileField(
        upload_to='uploads/%Y/%m/%d/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'])]
    )
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES)
    original_filename = models.CharField(max_length=255)
    file_size = models.IntegerField(help_text="File size in bytes")
    
    # Metadata
    uploaded_by = models.CharField(max_length=255, default="Anonymous")
    upload_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    
    # For images - store dimensions
    image_width = models.IntegerField(null=True, blank=True)
    image_height = models.IntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-upload_date']
        indexes = [
            models.Index(fields=['file_type', '-upload_date']),
            models.Index(fields=['uploaded_by']),
        ]
    
    def __str__(self):
        return f"{self.original_filename} ({self.get_file_type_display()})"
    
    def get_file_extension(self):
        """Get file extension"""
        return self.file.name.split('.')[-1].lower()
    
    @property
    def file_url(self):
        """Get the full file URL"""
        return self.file.url if self.file else None
