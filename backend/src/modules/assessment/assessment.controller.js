
const assessmentService = require('./assessment.service');
const { successResponse, successResponseWithPagination, errorResponse } = require('../../utils/response');

class AssessmentController {
  // Submit assessment (Karyawan)
  async submit(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await assessmentService.submitAssessment(userId, req.body);

      if (!result.success) {
        return errorResponse(res, result.message, 400, result.missing_questions);
      }

      return successResponse(res, result.data, 'Assessment berhasil disubmit', 201);
    } catch (error) {
      next(error);
    }
  }

  // Save as draft (Karyawan)
  async saveDraft(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await assessmentService.saveDraft(userId, req.body);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, 'Draft berhasil disimpan');
    } catch (error) {
      next(error);
    }
  }

  // Get my assessment history (Karyawan)
  async getMyHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 10 } = req.query;

      const result = await assessmentService.getMyHistory(userId, page, limit);

      return successResponseWithPagination(
        res,
        result.data,
        result.pagination,
        'Riwayat assessment berhasil diambil'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get assessment detail
  async getDetail(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const userRole = req.user.role;

      const result = await assessmentService.getAssessmentDetail(id, userId, userRole);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data);
    } catch (error) {
      next(error);
    }
  }

  // Review assessment (Manager)
  async review(req, res, next) {
    try {
      const { id } = req.params;
      const managerId = req.user.userId;
      const { catatan_manager } = req.body;

      const result = await assessmentService.reviewAssessment(id, managerId, catatan_manager);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }
}


module.exports = new AssessmentController();
