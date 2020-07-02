import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleType } from '../database/role-type.enum';
import { AuthenticatedRequest } from './authenticated-request.interface';
import { RolesGuard } from './roles.guard';

xdescribe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            constructor: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should skip(return true) if the `HasRoles` decorator is not set', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue([]);
    const context = createMock<ExecutionContext>({
      getHandler: jest.fn(),
    });
    const result = await guard.canActivate(context);

    expect(result).toBeTruthy();
    expect(reflector.get).toBeCalled();
  });

  it('should return true if the `HasRoles` decorator is set', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue([RoleType.USER]);
    const context = createMock<ExecutionContext>({
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { roles: [RoleType.USER] },
        } as AuthenticatedRequest),
      }),
    });

    const result = await guard.canActivate(context);
    expect(result).toBeTruthy();
    expect(reflector.get).toBeCalled();
  });

  it('should return false if the `HasRoles` decorator is set but role is not allowed', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue([RoleType.ADMIN]);
    const context = createMock<ExecutionContext>({
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { roles: [RoleType.USER] },
        } as AuthenticatedRequest),
      }),
    });

    const result = await guard.canActivate(context);
    expect(result).toBeFalsy();
    expect(reflector.get).toBeCalled();
  });
});
