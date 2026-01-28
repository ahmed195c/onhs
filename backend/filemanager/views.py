from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import UploadedFile
from .serializers import UploadedFileSerializer


class UploadedFileViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing uploaded files (PDFs and images)
    """
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def get_queryset(self):
        """Filter files by type if provided"""
        queryset = UploadedFile.objects.all()
        file_type = self.request.query_params.get('file_type')
        
        if file_type:
            queryset = queryset.filter(file_type=file_type)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Handle file upload"""
        file_obj = request.FILES.get('file')
        
        if not file_obj:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (50MB max)
        if file_obj.size > 50 * 1024 * 1024:
            return Response(
                {'error': 'File size exceeds 50MB limit'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Determine file type
        extension = file_obj.name.split('.')[-1].lower()
        if extension == 'pdf':
            file_type = 'pdf'
        elif extension in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']:
            file_type = 'image'
        else:
            return Response(
                {'error': f'File type .{extension} not allowed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create the file object
        uploaded_file = UploadedFile.objects.create(
            file=file_obj,
            file_type=file_type,
            original_filename=file_obj.name,
            file_size=file_obj.size,
            uploaded_by=request.data.get('uploaded_by', 'Anonymous'),
            description=request.data.get('description', '')
        )
        
        serializer = UploadedFileSerializer(uploaded_file)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def images(self, request):
        """Get all images"""
        images = UploadedFile.objects.filter(file_type='image')
        serializer = UploadedFileSerializer(images, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pdfs(self, request):
        """Get all PDFs"""
        pdfs = UploadedFile.objects.filter(file_type='pdf')
        serializer = UploadedFileSerializer(pdfs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download file"""
        uploaded_file = self.get_object()
        return Response({
            'download_url': uploaded_file.file_url,
            'filename': uploaded_file.original_filename
        })
